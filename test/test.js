const assert = require('assert');
const firebase = require('@firebase/testing');

const MY_PROJECT_ID = "progressnotes-b6fc9";
const myId = "user_abc"
const studentId = "studentId"
const theirId = "user_xyz"
const myAuth = {uid: myId, email: "abc@gmail.com"}
const studentAuth = {uid: studentId, email: "student@gmail.com"}

function getFirestore(auth) {
  return firebase.initializeTestApp({projectId: MY_PROJECT_ID, auth: auth}).firestore()
}

function getAdminFirestore() {
  return firebase.initializeAdminApp({projectId: MY_PROJECT_ID}).firestore()
}

beforeEach(async() => {
  await firebase.clearFirestoreData({projectId: MY_PROJECT_ID})
})

describe("Student notes app", () => {

  it("Can read a user doc with the same id as our user", async() => {
    const db = getFirestore(myAuth)
    const testUser = db.collection("users").doc(myId)
    await firebase.assertSucceeds(testUser.get())
  })

  it("Can read notes if admin", async() => {
    const admin = getAdminFirestore()
    const adminDoc = admin.collection("users").doc(myId)
    await adminDoc.set({admin : true})
    
    const db = getFirestore(myAuth)
    const testNotes = db.collectionGroup("notes");
    await firebase.assertSucceeds(testNotes.get());
  })

  it("Can read notes created by user", async() => {
    const admin = getAdminFirestore()
    const noteId = "any_note"
    const aNote = admin.collection("users").doc(studentId).collection("notes").doc(noteId)
    await aNote.set({uid : studentId})
    
    const db = getFirestore(studentAuth)
    const testNotes = db.collection("users").doc(studentId).collection("notes").where("uid","==",studentId);
    await firebase.assertSucceeds(testNotes.get());
  })

  it("Does not allow user to edit notes of another student", async() => {
    const noteId = "any_note"
    const admin = getAdminFirestore()
    await admin.collection("users").doc(myId).collection("notes").doc(noteId).set({uid: myId, body: "before body"})

    const db = getFirestore(studentAuth)
    const testDoc = db.collection("users").doc(myId).collection("notes").doc(noteId)
    await firebase.assertFails(testDoc.update({content: "after"}))
  })

  it("Allows user to edit their own notes", async() => {
    const noteId = "any_note"
    const admin = getAdminFirestore()
    await admin.collection("users").doc(studentId).collection("notes").doc(noteId).set({uid: studentId, body: "before body"})

    const db = getFirestore(studentAuth)
    const testDoc = db.collection("users").doc(studentId).collection("notes").doc(noteId)
    await firebase.assertSucceeds(testDoc.update({body: "after"}))
  })

  it("Can't change the uid field in notes documents", async() => {
    const noteId = "any_note"
    const admin = getAdminFirestore()
    await admin.collection("users").doc(studentId).collection("notes").doc(noteId).set({uid: studentId, body: "before body"})

    const db = getFirestore(studentAuth)
    const testDoc = db.collection("users").doc(studentId).collection("notes").doc(noteId)
    await firebase.assertFails(testDoc.update({uid: myId, body: "after"}))
  })

  it("Can't change the admin field of a user document", async() => {
    const admin = getAdminFirestore()
    const adminDoc = admin.collection("users").doc(myId)
    await adminDoc.set({admin : false})
    
    const db = getFirestore(myAuth)
    const testUser = db.collection("users").doc(myId);
    await firebase.assertFails(testUser.set({admin: true}));
  })

  it("Can create notes if uid field is same as authenticated user", async() => {
    const noteId = "any_note"
    const db = getFirestore(studentAuth)
    const testDoc = db.collection("users").doc(studentId).collection("notes").doc(noteId)
    await firebase.assertSucceeds(testDoc.set({uid: studentId, body: "after"}))
  })

  it("Can't create notes if uid field is NOT same as authenticated user", async() => {
    const noteId = "any_note"
    const db = getFirestore(studentAuth)
    const testDoc = db.collection("users").doc(studentId).collection("notes").doc(noteId)
    await firebase.assertFails(testDoc.set({uid: myId, body: "after"}))
  })

  it("Can create a new user with allowed fields", async() => {
    const db = getFirestore(studentAuth)
    const testUser = db.collection("users").doc(studentId)
    await firebase.assertSucceeds(testUser.set({lastName:"last", firstName: "first", fullName: "full", email: "student@gmail.com"}))
  })

  it("Cannot create a new user with an admin field", async() => {
    const db = getFirestore(studentAuth)
    const testUser = db.collection("users").doc(studentId)
    await firebase.assertFails(testUser.set({admin: true, lastName:"last", firstName: "first", fullName: "full", email: "student@gmail.com"}))
  })

})
