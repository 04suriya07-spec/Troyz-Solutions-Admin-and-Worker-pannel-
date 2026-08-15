// TaskFlow Cloud Synchronization Module (Firebase Firestore & Firebase Storage)
(function() {
  const CLOUD_CONFIG_KEY = 'taskflow_firebase_config';
  const STORAGE_KEY = 'taskflow_data';

  const DEFAULT_FIREBASE_CONFIG = {
    apiKey: "AIzaSyDRgT4J9_LS_tX4_qw0wwvtd08hqtLlBmg",
    authDomain: "troyz-solutions.firebaseapp.com",
    projectId: "troyz-solutions",
    storageBucket: "troyz-solutions.firebasestorage.app",
    messagingSenderId: "962661954208",
    appId: "1:962661954208:web:c65b21a141564ddd018fc5",
    measurementId: "G-P01SFEJWCP"
  };

  window.TaskFlowCloud = {
    db: null,
    storage: null,
    isCloudActive: false,

    getSavedConfig() {
      try {
        const saved = localStorage.getItem(CLOUD_CONFIG_KEY);
        if (saved) return JSON.parse(saved);
        return DEFAULT_FIREBASE_CONFIG;
      } catch (e) {
        return DEFAULT_FIREBASE_CONFIG;
      }
    },

    saveConfig(config) {
      localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify(config));
    },

    init() {
      const config = this.getSavedConfig();
      if (config && config.apiKey && config.projectId && window.firebase) {
        try {
          if (!firebase.apps.length) {
            firebase.initializeApp(config);
          }
          this.db = firebase.firestore();
          if (firebase.storage) {
            this.storage = firebase.storage();
          }
          this.isCloudActive = true;
          this.listenToCloud();
          console.log('⚡ TaskFlow Cloud Sync active via Firebase Firestore & Storage (Project: ' + config.projectId + ')');
        } catch (err) {
          console.error('Firebase Cloud initialization error:', err);
          this.isCloudActive = false;
        }
      }
    },

    listenToCloud() {
      if (!this.db) return;
      this.db.collection('taskflow').doc('app_data').onSnapshot((doc) => {
        if (doc.exists) {
          const cloudData = doc.data();
          if (cloudData && cloudData.payload) {
            const localDataStr = localStorage.getItem(STORAGE_KEY);
            const cloudDataStr = JSON.stringify(cloudData.payload);
            if (localDataStr !== cloudDataStr) {
              localStorage.setItem(STORAGE_KEY, cloudDataStr);
              if (window.renderHome) window.renderHome();
              if (window.renderInbox) window.renderInbox();
              if (window.renderAllTasks) window.renderAllTasks();
              if (window.renderSubmissionsPage) window.renderSubmissionsPage();
            }
          }
        }
      }, (error) => {
        console.warn('Firestore snapshot listener warning:', error);
      });
    },

    async pushToCloud(data) {
      if (!this.isCloudActive || !this.db) return false;
      try {
        await this.db.collection('taskflow').doc('app_data').set({
          payload: data,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        console.log('✅ Successfully synced TaskFlow data with Firebase Cloud!');
        return true;
      } catch (err) {
        console.error('Push to Cloud error:', err);
        if (err && err.code === 'permission-denied') {
          console.warn('⚠️ Firestore Security Rules blocked this request. Set "allow read, write: if true;" in Firebase Rules tab and click Publish.');
        }
        return false;
      }
    },

    async uploadFile(file, folder = 'submissions', onProgress = null) {
      if (!this.isCloudActive || !this.storage) {
        throw new Error('Firebase Storage is not available or disconnected.');
      }
      try {
        const timestamp = Date.now();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const path = `${folder}/${timestamp}_${sanitizedName}`;
        const fileRef = this.storage.ref().child(path);
        
        const uploadTask = fileRef.put(file);
        
        return new Promise((resolve, reject) => {
          uploadTask.on('state_changed', 
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              if (onProgress) onProgress(progress);
            },
            (error) => {
              console.error('Firebase Storage upload error:', error);
              reject(error);
            },
            async () => {
              const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
              resolve({
                name: file.name,
                size: file.size,
                type: file.type,
                path: path,
                url: downloadURL,
                uploadedAt: new Date().toISOString()
              });
            }
          );
        });
      } catch (err) {
        console.error('Firebase Storage upload exception:', err);
        throw err;
      }
    }
  };

  window.addEventListener('DOMContentLoaded', () => {
    window.TaskFlowCloud.init();
  });
})();
