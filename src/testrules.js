rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
    	match /notes/{noteId} {
      	allow read: if request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.admin == true
        allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.get("admin",false) ? request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.admin == true : request.auth.uid == userId
      }
    }
  }
}