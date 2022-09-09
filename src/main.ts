import App from './App.svelte';
import {initializeApp} from "firebase/app";
import {getAuth, signInAnonymously} from "firebase/auth";
import {getFirestore, collection, doc, getDoc, setDoc, getDocs} from "firebase/firestore";
import {writable} from "svelte/store";
import {UserData} from "./lib/UserData";
import {getQueryString} from "./lib/util";
import {Stamp} from "./lib/Stamp";


//firebase initialization
const firebaseConfig = {
    apiKey: "AIzaSyBHJVaSx7M3eQHlCw87sPsP5BMWBJt7TfA",
    authDomain: "kigyokutest.firebaseapp.com",
    projectId: "kigyokutest",
    storageBucket: "kigyokutest.appspot.com",
    messagingSenderId: "167741060546",
    appId: "1:167741060546:web:b55a9bcbc4dafbf720525b"
};

const firebaseApp = initializeApp(firebaseConfig);

//initialize firebase auth
export let authenticated = writable(false);
export let userdata = writable(new UserData());
const auth = getAuth(firebaseApp)
const firestore = getFirestore(firebaseApp)
export let claimingStamp = writable("");

signInAnonymously(auth)
    .then(async () => {
        console.log("signed in")

        //load userdata from firestore
        const docRef = doc(collection(firestore, 'users'), auth.currentUser.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            userdata.set(Object.assign(new UserData(), docSnap.data()))
        }
        userdata.subscribe((it) => {
            setDoc(docRef, Object.assign({}, it))
        })

        //check claiming stamp
        if(getQueryString().has("claim")) {
            claimingStamp.set(getQueryString().get("claim").toString())
            userdata.update((it) => {
                it.stamps.push(getQueryString().get("claim").toString())
                return it;
            })
            window.history.replaceState('','','/');
        }

        authenticated.set(true)
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + ":" + errorMessage)
    })

//Load stamps
export const stamps = writable(new Array<Stamp>())
getDocs(collection(firestore, 'stamps')).then((it) => {
    it.forEach((it) => {
        stamps.update((array) => {
            array.push(new Stamp(it.id,it.get("name")))
            return array;
        })
    })
})

//App initialization
const app = new App({
    target: document.body,
    props: {
        name: 'world'
    }
});

export default app;

