const assert = require('assert');
const firebase = require('@firebase/testing');

const MY_PROJECT_ID = "progressnotes-b6fc9";
const myId = "user_abc"
const studentId = "studentId"
const otherStudentId = "otherStudentId"
const theirId = "user_xyz"
const myAuth = {uid: myId, email: "abc@gmail.com"}
const studentAuth = {uid: studentId, email: "student@gmail.com"}
const anotherStudentAuth = {uid: otherStudentId}
const aNote = "someNote"
const studentNote = {uid: studentId, noteId: aNote}

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

//USER DOCUMENTS

  it("Can read a user doc with the same id as our user", async() => {
    const db = getFirestore(myAuth)
    const testUser = db.collection("users").doc(myId)
    await firebase.assertSucceeds(testUser.get())
  })

  it("Can't change the admin field of a user document", async() => {
    const admin = getAdminFirestore()
    const adminDoc = admin.collection("users").doc(myId)
    await adminDoc.set({admin : false})
    
    const db = getFirestore(myAuth)
    const testUser = db.collection("users").doc(myId);
    await firebase.assertFails(testUser.set({admin: true}));
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

//NOTES DOCUMENTS

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

//COMMENTS DOCUMENTS

  it("Can create comments if uid field is same as authenticated user", async() => {
    const commentId = "any_comment"
    const db = getFirestore(studentAuth)
    const testDoc = db.collection("users").doc(studentId).collection("notes").doc(aNote).collection("comments").doc(commentId)
    await firebase.assertSucceeds(testDoc.set({uid: studentId, body: "after"}))
  })

  it("Can read comments if uid field is same as authenticated user", async() => {
    const admin = getAdminFirestore()
    const noteId = "any_note"
    const commentId = "any_comment"
    const aComment = admin.collection("users").doc(studentId).collection("notes").doc(noteId).collection("comments").doc(commentId)
    await aComment.set({uid : studentId})

    const db = getFirestore(studentAuth)
    const testDoc = db.collection("users").doc(studentId).collection("notes").doc(noteId).collection("comments").doc(commentId)
    await firebase.assertSucceeds(testDoc.get())
  })

  it("Can read comments if studentId field is same as authenticated user", async() => {
    const admin = getAdminFirestore()
    const noteId = "any_note"
    const commentId = "any_comment"
    const aComment = admin.collection("users").doc(studentId).collection("notes").doc(noteId).collection("comments").doc(commentId)
    await aComment.set({studentId : studentId})

    const db = getFirestore(studentAuth)
    const testDoc = db.collection("users").doc(studentId).collection("notes").doc(noteId).collection("comments").doc(commentId)
    await firebase.assertSucceeds(testDoc.get())
  })

  it("Can read comments if admin", async() => {
    const admin = getAdminFirestore()
    const adminDoc = admin.collection("users").doc(myId)
    await adminDoc.set({admin : true})
    
    const db = getFirestore(myAuth)
    const testComments = db.collectionGroup("comments");
    await firebase.assertSucceeds(testComments.get());
  })

  //MyBADGE DOCUMENTS

  it("Can set badge doc to myBadge collection if admin", async() => {
    const admin = getAdminFirestore()
    const adminDoc = admin.collection("users").doc(myId)
    await adminDoc.set({admin : true})
    
    const db = getFirestore(myAuth)
    const testBadge = db.collection("badges").doc("a badge");
    await firebase.assertSucceeds(testBadge.set({Title: "a badge"}));
  })

  it("Can set badge doc to user's own myBadge collection", async() => {
    const badgeId = "some_badge"
    const db = getFirestore(studentAuth)
    const testDoc = db.collection("users").doc(studentId).collection("myBadges").doc(badgeId);
    await firebase.assertSucceeds(testDoc.set({foo: "bar", uid: studentId}));
  })

  it("Can read badge doc from myBadge collection if admin", async() => {
    const admin = getAdminFirestore()
    const adminDoc = admin.collection("users").doc(myId)
    await adminDoc.set({admin : true})
    
    const db = getFirestore(myAuth)
    const studentBadges = db.collectionGroup("myBadges").where("uid","==",studentId);
    await firebase.assertSucceeds(studentBadges.get());
  })

  it("Can read badge doc from user's myBadge collection", async() => {
    const admin = getAdminFirestore()
    const badgeId = "some_badge"
    const aBadge = admin.collection("users").doc(studentId).collection("myBadges").doc(badgeId)
    await aBadge.set({uid : studentId})
    
    const db = getFirestore(studentAuth)
    const testBadges = db.collection("users").doc(studentId).collection("myBadges").where("uid","==",studentId);
    await firebase.assertSucceeds(testBadges.get());
  })

  it("Can NOT read badge doc from another user's myBadge collection", async() => {
    const admin = getAdminFirestore()
    const badgeId = "some_badge"
    const aBadge = admin.collection("users").doc(studentId).collection("myBadges").doc(badgeId)
    await aBadge.set({uid : studentId})
    
    const db = getFirestore(anotherStudentAuth)
    const testBadges = db.collection("users").doc(studentId).collection("myBadges").where("uid","==",studentId);
    await firebase.assertFails(testBadges.get());
  })

  //BADGES DOCUMENTS

  it("Can read badge doc from badges collection", async() => {
    const db = getFirestore(studentAuth)
    const badgeList = db.collection("badges");
    await firebase.assertSucceeds(badgeList.get());
  })

  it("Can write badges if admin", async() => {
    const admin = getAdminFirestore()
    const adminDoc = admin.collection("users").doc(myId)
    await adminDoc.set({admin : true})
    
    const db = getFirestore(myAuth)
    const badgeDoc = db.collection("badges").doc("some_badge");
    await firebase.assertSucceeds(badgeDoc.set({Title: "a new badge"}));
  })

  it("Can NOT write badges if NOT admin", async() => {
    const db = getFirestore(studentAuth)
    const badgeDoc = db.collection("badges").doc("some_badge");
    await firebase.assertFails(badgeDoc.set({Title: "a new badge"}));
  })

  //FEEDBACK FORM DOCUMENTS

  it("Can write fb_forms if admin", async() => {
    const admin = getAdminFirestore()
    const adminDoc = admin.collection("users").doc(myId)
    await adminDoc.set({admin : true})
    
    const db = getFirestore(myAuth)
    const fbDoc = db.collection("fbForms").doc("some_fb");
    await firebase.assertSucceeds(fbDoc.set({Title: "a new fb_form"}));
  })

  it("Can read fb_forms if admin", async() => {
    const admin = getAdminFirestore()
    const adminDoc = admin.collection("users").doc(myId)
    await adminDoc.set({admin : true})
    
    const db = getFirestore(myAuth)
    const fbDocs = db.collectionGroup("fbForms");
    await firebase.assertSucceeds(fbDocs.get());
  })

  it("Can read fb_forms from user's fb_form collection", async() => {
    const admin = getAdminFirestore()
    const fbFormId = "fb_form"
    const anFbForm = admin.collection("users").doc(studentId).collection("fbForms").doc(fbFormId)
    await anFbForm.set({uid : studentId})

    const db = getFirestore(studentAuth)
    const fbDocs = db.collection("users").doc(studentId).collection("fbForms").where("uid", "==",studentId);
    await firebase.assertSucceeds(fbDocs.get());
  })

  it("Can NOT write fb_form if NOT admin", async() => {
    const db = getFirestore(studentAuth)
    const fbDoc = db.collection("users").doc(studentId).collection("fbForms").doc("some_fb");
    await firebase.assertFails(fbDoc.set({Title: "a new fb_form"}));
  })

  //ADMIN DOCS

  it("Can read the student list if admin", async() => {
    const admin = getAdminFirestore()
    const adminDoc = admin.collection("users").doc(myId)
    await adminDoc.set({admin : true})

    const db = getFirestore(myAuth)
    const studentList = db.collection("adminDocs").doc("studentList");
    await firebase.assertSucceeds(studentList.get());

  })

  it("Allows user to add a new element to the students array in the studentList document", async() => {
    const admin = getAdminFirestore()
    await admin.collection("adminDocs").doc("studentList").set({students:[{uid: anotherStudentAuth, year: 2022}]})

    const db = getFirestore(studentAuth)
    const newRecord = db.collection("adminDocs").doc("studentList")
    await firebase.assertSucceeds(newRecord.update({students: firebase.firestore.FieldValue.arrayUnion({uid: "hello", year: 2022})}))
  })

  it("Does NOT allow user to add two elements to the students array in the studentList document", async() => {
    const admin = getAdminFirestore()
    await admin.collection("adminDocs").doc("studentList").set({students:[{uid: anotherStudentAuth, year: 2022}]})

    const db = getFirestore(studentAuth)
    const newRecord = db.collection("adminDocs").doc("studentList")
    await firebase.assertFails(newRecord.update({students: firebase.firestore.FieldValue.arrayUnion({uid: "hello", year: 2022},{uid: "hello again", year:2022})}))
  })

  it("Does NOT allow user to update previous element of students array in the studentList document", async() => {
    const admin = getAdminFirestore()
    await admin.collection("adminDocs").doc("studentList").set({students:[{uid: anotherStudentAuth, year: 2022}]})

    const db = getFirestore(studentAuth)
    const newRecord = db.collection("adminDocs").doc("studentList")
    await firebase.assertFails(newRecord.update({students: firebase.firestore.FieldValue.arrayRemove({uid: anotherStudentAuth, year: 2022})}))
  })

  it("Can read the classes list for authenticated users", async() => {

    const db = getFirestore(myAuth)
    const classesList = db.collection("adminDocs").doc("classesList");
    await firebase.assertSucceeds(classesList.get());

  })

  it("Allows admin user to update an element to the classes array in the classesList document", async() => {
    const admin = getAdminFirestore()
    const adminDoc = admin.collection("users").doc(myId)
    await adminDoc.set({admin : true})
    await admin.collection("adminDocs").doc("classesList").set({classes:[{classId: anotherStudentAuth, classname: "a class", supportedBadges:[{badgeId:"someId", badgename:"someBadge"}]}]})

    const db = getFirestore(myAuth)
    const newRecord = db.collection("adminDocs").doc("classesList")
    await firebase.assertSucceeds(newRecord.update({classes: "check" }))
  })

})
