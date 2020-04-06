// valiables
let initialized = false;
const dbName = 'live-share';

// functions
class Firestore {
  constructor({ firebase, apiKey, projectId }) {
    console.log({ apiKey, projectId });
    this.firebase = firebase;
    if (!initialized) this.initFirebase({ apiKey, projectId });
    this.setDbRef();
    this.setListener();
    this.render();
  }

  initFirebase({ apiKey, projectId }) {
    this.firebase.initializeApp({ apiKey, projectId });
    initialized = true;
  }

  setDbRef() {
    this.dbRef = this.firebase
      .firestore()
      .collection(dbName)
      .orderBy('timestamp', 'desc');
  }

  setListener() {
    this.unsubscribe = this.dbRef.onSnapshot(snapshot => {
      const messages = snapshot.docs.map(doc => doc.data());
      console.log({ messages });
    });
    const removeListener = () => {
      console.log('unsubscribe');
      this.unsubscribe();
      document.removeEventListener('unsubscribe-firestore', removeListener);
    };
    document.addEventListener('unsubscribe-firestore', removeListener);
  }

  render() {
    console.log('render');
  }
}

function excute(event) {
  try {
    const { apiKey, projectId } = event.detail;
    const f = new Firestore({ firebase, apiKey, projectId });
    console.log(f);
  } catch (error) {
    console.log(error);
  }
}

// listeners
document.addEventListener('subscribe-firestore', excute);
