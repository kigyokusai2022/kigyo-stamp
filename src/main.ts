import App from './App.svelte';
import {initializeApp} from "firebase/app";
import {getAuth, signInAnonymously} from "firebase/auth";
import {getFirestore, collection, doc, getDoc, setDoc} from "firebase/firestore";
import {Readable, readable, writable} from "svelte/store";
import {UserData} from "./lib/UserData";
import {getQueryString} from "./lib/util";
import Cookies from "js-cookie";

//stores
export let userdata = writable(new UserData());
export let claimingStamp = writable("");
export let authenticated = writable(false);

// load stamp cache
const claimedStamps = Cookies.get("claimedStamps")
export let claimedStampsCache: Readable<string>
if(claimedStamps != undefined) {
    claimedStampsCache = readable(Cookies.get("claimedStamps")?.split(","));
} else {
    claimedStampsCache = readable("");
}

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

//App initialization
const app = new App({
    target: document.body,
    props: {
        name: 'world'
    }
});

export default app;

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
const auth = getAuth(firebaseApp)
const firestore = getFirestore(firebaseApp)

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
            userdata.subscribe((it) => {
                if(it.stamps.indexOf(claim) < 0) {
                    it.stamps.push(claim)
                    Cookies.set("claimedStamps", it.stamps.join(","))
                    setDoc(docRef, Object.assign({}, it))
                }
                authenticated.set(true);
            })
            window.history.replaceState('','','/');
        } else {
            authenticated.set(true);
        }
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + ":" + errorMessage)
    })

