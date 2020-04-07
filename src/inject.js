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
  }

  initFirebase({ apiKey, projectId }) {
    this.firebase.initializeApp({ apiKey, projectId });
    initialized = true;
  }

  setDbRef() {
    this.dbRef = this.firebase.firestore().collection(dbName);
  }

  setPublishListener() {
    console.log('#setPublishListener');

    this.unsubscribe = window.addEventListener('locationchange', e => {
      console.log('locationchange');
      const message = {
        url: window.location.href,
        timestamp: this.firebase.firestore.FieldValue.serverTimestamp(),
      };
      this.dbRef.add(message);
    });

    const removeListener = () => {
      console.log('unsubscribe');
      this.unsubscribe();
      document.removeEventListener('unsubscribe-firestore', removeListener);
    };
    document.addEventListener('unsubscribe-firestore', removeListener);
  }

  setSubscribeListener() {
    console.log('#setSubscribeListener');
    this.unsubscribe = this.dbRef
      .orderBy('timestamp', 'desc')
      .limit(1)
      .onSnapshot(snapshot => {
        const messages = snapshot.docs.map(doc => doc.data());
        console.log(messages);
        if (messages.length) window.location.href = messages[0].url;
      });
    const removeListener = () => {
      console.log('unsubscribe');
      this.unsubscribe();
      document.removeEventListener('unsubscribe-firestore', removeListener);
    };
    document.addEventListener('unsubscribe-firestore', removeListener);
  }
}

function excute(event) {
  try {
    const { apiKey, projectId, activateValue } = event.detail;
    const f = new Firestore({ firebase, apiKey, projectId });

    switch (activateValue) {
      case 'publish':
        f.setPublishListener();
        break;
      case 'subscribe':
        f.setSubscribeListener();
        break;
      default:
        console.log(`invalid value: ${activateValue}`);
    }
  } catch (error) {
    console.log(error);
  }
}

function init() {
  window.history.pushState = (f =>
    // eslint-disable-next-line
    function (...args) {
      const ret = f.apply(this, args);
      window.dispatchEvent(new Event('pushstate'));
      window.dispatchEvent(new Event('locationchange'));
      return ret;
    })(window.history.pushState);

  window.history.replaceState = (f =>
    // eslint-disable-next-line
    function (...args) {
      const ret = f.apply(this, args);
      window.dispatchEvent(new Event('replacestate'));
      window.dispatchEvent(new Event('locationchange'));
      return ret;
    })(window.history.replaceState);

  window.addEventListener('popstate', () => {
    window.dispatchEvent(new Event('locationchange'));
  });
  window.addEventListener('locationchange', () => {
    console.log('location changed!');
  });
}

// listeners
document.addEventListener('subscribe-firestore', excute);

// excutes
init();
