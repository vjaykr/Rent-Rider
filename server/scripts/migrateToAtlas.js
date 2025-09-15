const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Review = require('../models/Review');

// Connection configurations
const LOCAL_URI = 'mongodb://localhost:27017/rentrider';
const ATLAS_URI = process.env.MONGODB_URI;

class AtlasMigration {
  constructor() {
    this.localConnection = null;
    this.atlasConnection = null;
  }

  async connectToLocal() {
    try {
      this.localConnection = await mongoose.createConnection(LOCAL_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✅ Connected to local MongoDB');
      return this.localConnection;
    } catch (error) {
      console.error('❌ Failed to connect to local MongoDB:', error.message);
      throw error;
    }
  }

  async connectToAtlas() {
    try {
      this.atlasConnection = await mongoose.createConnection(ATLAS_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferMaxEntries: 0,
        bufferCommands: false,
        maxPoolSize: 10,
        minPoolSize: 5,
        maxIdleTimeMS: 30000,
        family: 4
      });
      console.log('✅ Connected to MongoDB Atlas');
      return this.atlasConnection;
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB Atlas:', error.message);
      throw error;
    }
  }

  async migrateCollection(modelName, Model) {
    try {
      console.log(`\n📦 Migrating ${modelName}...`);
      
      // Get local model
      const LocalModel = this.localConnection.model(modelName, Model.schema);
      
      // Get Atlas model
      const AtlasModel = this.atlasConnection.model(modelName, Model.schema);
      
      // Count documents in local
      const localCount = await LocalModel.countDocuments();
      console.log(`   📊 Found ${localCount} documents in local ${modelName}`);
      
      if (localCount === 0) {
        console.log(`   ⚠️  No documents to migrate for ${modelName}`);
        return { migrated: 0, skipped: 0, errors: 0 };
      }
      
      // Get all documents from local
      const localDocs = await LocalModel.find({}).lean();
      
      let migrated = 0;
      let skipped = 0;
      let errors = 0;
      
      // Migrate documents in batches
      const batchSize = 100;
      for (let i = 0; i < localDocs.length; i += batchSize) {
        const batch = localDocs.slice(i, i + batchSize);
        
        try {
          // Check if documents already exist in Atlas
          const batchIds = batch.map(doc => mongoose.Types.ObjectId(doc._id));
          const existingIds = await AtlasModel.find({
            _id: { $in: batchIds }
          }).distinct('_id');
          
          // Filter out existing documents
          const newDocs = batch.filter(doc => 
            !existingIds.some(id => id.toString() === doc._id.toString())
          );
          
          if (newDocs.length > 0) {
            await AtlasModel.insertMany(newDocs, { ordered: false });
            migrated += newDocs.length;
            console.log(`   ✅ Migrated batch: ${newDocs.length} documents`);
          }
          
          skipped += batch.length - newDocs.length;
          
        } catch (error) {
          console.error(`   ❌ Error migrating batch:`, error.message);
          errors += batch.length;
        }
      }
      
      console.log(`   📈 Migration complete: ${migrated} migrated, ${skipped} skipped, ${errors} errors`);
      return { migrated, skipped, errors };
      
    } catch (error) {
      console.error(`❌ Failed to migrate ${modelName}:`, error.message);
      return { migrated: 0, skipped: 0, errors: localCount || 0 };
    }
  }

  async createIndexes() {
    try {
      console.log('\n🔍 Creating indexes on Atlas...');
      
      const models = [
        { name: 'User', model: User },
        { name: 'Vehicle', model: Vehicle },
        { name: 'Booking', model: Booking },
        { name: 'Payment', model: Payment },
        { name: 'Review', model: Review }
      ];
      
      for (const { name, model } of models) {
        try {
          const AtlasModel = this.atlasConnection.model(name, model.schema);
          await AtlasModel.createIndexes();
          console.log(`   ✅ Created indexes for ${name}`);
        } catch (error) {
          console.error(`   ❌ Failed to create indexes for ${name}:`, error.message);
        }
      }
      
    } catch (error) {
      console.error('❌ Failed to create indexes:', error.message);
    }
  }

  async validateMigration() {
    try {
      console.log('\n🔍 Validating migration...');
      
      const models = [
        { name: 'User', model: User },
        { name: 'Vehicle', model: Vehicle },
        { name: 'Booking', model: Booking }
      ];
      
      let allValid = true;
      
      for (const { name, model } of models) {
        try {
          const LocalModel = this.localConnection.model(name, model.schema);
          const AtlasModel = this.atlasConnection.model(name, model.schema);
          
          const localCount = await LocalModel.countDocuments();
          const atlasCount = await AtlasModel.countDocuments();
          
          console.log(`   📊 ${name}: Local=${localCount}, Atlas=${atlasCount}`);
          
          if (localCount !== atlasCount) {
            console.log(`   ⚠️  Count mismatch for ${name}`);
            allValid = false;
          } else {
            console.log(`   ✅ ${name} validation passed`);
          }
          
        } catch (error) {
          console.error(`   ❌ Validation failed for ${name}:`, error.message);
          allValid = false;
        }
      }
      
      return allValid;
      
    } catch (error) {
      console.error('❌ Validation failed:', error.message);
      return false;
    }
  }

  async migrate() {
    try {
      console.log('🚀 Starting migration from Local MongoDB to Atlas...\n');
      
      // Validate environment
      if (!ATLAS_URI) {
        throw new Error('MONGODB_URI not found in environment variables');
      }
      
      // Connect to both databases
      await this.connectToLocal();
      await this.connectToAtlas();
      
      // Migration order (important for referential integrity)
      const migrationOrder = [
        { name: 'User', model: User },
        { name: 'Vehicle', model: Vehicle },
        { name: 'Booking', model: Booking },
        { name: 'Payment', model: Payment },
        { name: 'Review', model: Review }
      ];
      
      const results = {};
      
      // Migrate collections
      for (const { name, model } of migrationOrder) {
        results[name] = await this.migrateCollection(name, model);
      }
      
      // Create indexes
      await this.createIndexes();
      
      // Validate migration
      const isValid = await this.validateMigration();
      
      // Summary
      console.log('\n📋 Migration Summary:');
      console.log('========================');
      
      let totalMigrated = 0;
      let totalSkipped = 0;
      let totalErrors = 0;
      
      for (const [collection, result] of Object.entries(results)) {
        console.log(`${collection}: ${result.migrated} migrated, ${result.skipped} skipped, ${result.errors} errors`);
        totalMigrated += result.migrated;
        totalSkipped += result.skipped;
        totalErrors += result.errors;
      }
      
      console.log('------------------------');
      console.log(`Total: ${totalMigrated} migrated, ${totalSkipped} skipped, ${totalErrors} errors`);
      console.log(`Validation: ${isValid ? '✅ PASSED' : '❌ FAILED'}`);
      
      if (isValid && totalErrors === 0) {
        console.log('\n🎉 Migration completed successfully!');
        console.log('You can now update your application to use MongoDB Atlas.');
      } else {
        console.log('\n⚠️  Migration completed with issues. Please review the errors above.');
      }
      
    } catch (error) {
      console.error('💥 Migration failed:', error.message);
    } finally {
      // Close connections
      if (this.localConnection) {
        await this.localConnection.close();
        console.log('🔌 Disconnected from local MongoDB');
      }
      
      if (this.atlasConnection) {
        await this.atlasConnection.close();
        console.log('🔌 Disconnected from MongoDB Atlas');
      }
    }
  }

  async checkConnections() {
    try {
      console.log('🔍 Checking database connections...\n');
      
      // Test local connection
      try {
        await this.connectToLocal();
        const localDb = this.localConnection.db;
        const collections = await localDb.listCollections().toArray();
        console.log(`✅ Local MongoDB: Connected (${collections.length} collections)`);
        await this.localConnection.close();
      } catch (error) {
        console.log(`❌ Local MongoDB: ${error.message}`);
      }
      
      // Test Atlas connection
      try {
        await this.connectToAtlas();
        const atlasDb = this.atlasConnection.db;
        const collections = await atlasDb.listCollections().toArray();
        console.log(`✅ MongoDB Atlas: Connected (${collections.length} collections)`);
        await this.atlasConnection.close();
      } catch (error) {
        console.log(`❌ MongoDB Atlas: ${error.message}`);
      }
      
    } catch (error) {
      console.error('💥 Connection check failed:', error.message);
    }
  }
}

// CLI interface
const migration = new AtlasMigration();

const command = process.argv[2];

switch (command) {
  case 'check':
    migration.checkConnections();
    break;
  case 'migrate':
    migration.migrate();
    break;
  default:
    console.log('📖 MongoDB Atlas Migration Tool');
    console.log('================================');
    console.log('');
    console.log('Usage:');
    console.log('  node migrateToAtlas.js check   - Check database connections');
    console.log('  node migrateToAtlas.js migrate - Migrate data from local to Atlas');
    console.log('');
    console.log('Prerequisites:');
    console.log('  1. Set MONGODB_URI in .env file with your Atlas connection string');
    console.log('  2. Ensure local MongoDB is running with existing data');
    console.log('  3. Ensure Atlas cluster is accessible');
    break;
}

module.exports = AtlasMigration;