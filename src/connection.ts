import mongoose from 'mongoose';

interface Connection {
  isConnected: boolean;
}

const connection: Connection = {
  isConnected: false,
};

export const connectDB = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log('Veritabanına zaten bağlandı!');
    return;
  }

  try {
    const baglanti = process.env.MONGODB_URI;
    const db = await mongoose.connect(baglanti as string);

    console.log('Yeni bağlantı kuruldu!');

    connection.isConnected = db.connections[0].readyState === 1;
  } catch (err) {
    console.error('Bağlantı başarısız!', err);
  }
};

export const disconnect = async (): Promise<void> => {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === 'production') {
      await mongoose.disconnect();
      connection.isConnected = false;
    }
    if (process.env.NODE_ENV === 'development') {
      await mongoose.disconnect();
      connection.isConnected = false;
    }
  }
};

export default connection;
