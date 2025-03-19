const admin = require('firebase-admin');
const db = require('../config/firebase');

const createData = async (collection, document, data) => {
  const doc = await db.collection(collection).doc(document);
  if ((await doc.get()).exists) {
    const error = new Error('Document already exists');
    error.status = 409;
    throw error;
  }
  await doc.set(data);
  return { success: true, message: `Created ${document} in ${collection}` };
};

const updateData = async (collection, document, data) => {
  const doc = db.collection(collection).doc(document);
  if (!(await doc.get()).exists) {
    const error = new Error('Document not found');
    error.status = 404;
    throw error;
  }
  await doc.update(data);
  return { success: true, message: `Updated ${document} in ${collection}` };
};

const deleteData = async (collection, document) => {
  const doc = db.collection(collection).doc(document);
  if (!(await doc.get()).exists) {
    const error = new Error('Document not found');
    error.status = 404;
    throw error;
  }
  await doc.delete();
  return { success: true, message: `Deleted ${document} from ${collection}` };
};

const readData = async (collection, document) => {
  const doc = await db.collection(collection).doc(document).get();
  if (!doc.exists) {
    const error = new Error('Document not found');
    error.status = 404;
    throw error;
  }
  return doc.data();
};

const readAllData = async (collection) => {
  const snapshot = await db.collection(collection).get();
  if (snapshot.empty) {
    const error = new Error('Collection is empty');
    error.status = 404;
    throw error;
  }
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

module.exports = {
  admin,
  createData,
  updateData,
  deleteData,
  readData,
  readAllData,
};