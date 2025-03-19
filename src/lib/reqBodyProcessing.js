const firebaseService = require('../services/firebaseService');

class BodyProcessing {
  async process(data) {
    const { action, content } = data;
    if (!action || !content) throw new Error('Missing action or content');

    switch (action) {
      case 'create':
        return await this.create(content);
      case 'update':
        return await this.update(content);
      case 'delete':
        return await this.delete(content);
      case 'read':
        return await this.read(content);
      case 'readAll':
        return await this.readAll(content);
      case 'getNumberOfDocuments':
        return await this.getNumberOfDocuments(content);
      default:
        throw new Error('Invalid action!');
    }
  }

  async create(content) {
    const { collection, document, data } = content;
    if (!collection || !document || !data) {
      throw new Error('Missing required fields: collection, document, or data');
    }
    const dataWithTimestamp = {
      ...data,
      timestamp: firebaseService.admin.firestore.FieldValue.serverTimestamp(),
    };
    return await firebaseService.createData(collection, document, dataWithTimestamp);
  }

  async update(content) {
    const { collection, document, data } = content;
    if (!collection || !document || !data) {
      throw new Error('Missing required fields: collection, document, or data');
    }
    return await firebaseService.updateData(collection, document, data);
  }

  async delete(content) {
    const { collection, document } = content;
    if (!collection || !document) {
      throw new Error('Missing required fields: collection or document');
    }
    return await firebaseService.deleteData(collection, document);
  }

  async read(content) {
    const { collection, document } = content;
    if (!collection || !document) {
      throw new Error('Missing required fields: collection or document');
    }
    return await firebaseService.readData(collection, document);
  }

  async readAll(content) {
    const { collection } = content;
    if (!collection) throw new Error('Missing required field: collection');
    return await firebaseService.readAllData(collection);
  }

  async getNumberOfDocuments(content) {
    const { collection } = content;
    if (!collection) throw new Error('Missing required field: collection');
    const data = await firebaseService.readAllData(collection);
    return data.length;
  }
}

module.exports = new BodyProcessing();