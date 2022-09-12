import App from './App.svelte';
import {initializeApp} from "firebase/app";
import {getAuth, signInAnonymously} from "firebase/auth";
import {getFirestore, collection, doc, getDoc, setDoc, getDocs} from "firebase/firestore";
import {writable} from "svelte/store";
import {UserData} from "./lib/UserData";
import {getQueryString} from "./lib/util";
import {Stamp} from "./lib/Stamp";

//font setup
(function(d) {
    var config = {
            kitId: 'eyg1wun',
            scriptTimeout: 3000,
            async: true
        },
        h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true; // @ts-ignore
    tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
})(document);

//firebase initialization
const firebaseConfig = {
    apiKey: "AIzaSyDqKbtrFVssyDBka7lUrUygkdvVygfDKf0",
    authDomain: "kigyo-stamp-1e35b.firebaseapp.com",
    projectId: "kigyo-stamp-1e35b",
    storageBucket: "kigyo-stamp-1e35b.appspot.com",
    messagingSenderId: "241351108267",
    appId: "1:241351108267:web:481b522bd9820220c979ee",
    measurementId: "G-SNWNW94KPH"
};

const firebaseApp = initializeApp(firebaseConfig);

//initialize firebase auth
export let authenticated = writable(false);
export let userdata = writable(new UserData());
export const stamps = writable(new Array<Stamp>())
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
        } else {
            await setDoc(docRef, Object.assign({}, new UserData()))
        }

        //check claiming stamp
        if(getQueryString().has("claim")) {
            const claim = getQueryString().get("claim").toString()
            claimingStamp.set(claim)
            userdata.update((it) => {
                if(it.stamps.indexOf(claim) < 0) {
                    it.stamps.push(claim)
                    setDoc(docRef, Object.assign({}, it))
                }
                return it;
            })
            window.history.replaceState('','','/');
        }

        //Load stamps
        getDocs(collection(firestore, 'stamps')).then((it) => {
            it.forEach((it) => {
                stamps.update((array) => {
                    array.push(new Stamp(it.id,it.get("name")))
                    return array;
                })
            })
        }).catch((e) => {console.log(e.code + e.message)})

        authenticated.set(true)
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + ":" + errorMessage)
    })


//App initialization
const app = new App({
    target: document.body,
    props: {
        name: 'world'
    }
});

export default app;

