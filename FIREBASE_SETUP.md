# Firebase Setup Guide for Quirozen Reservation System

This guide will help you set up Firebase Firestore to enable the reservation system to work when deployed.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter your project name (e.g., "quirozen-reservations")
4. Continue through the setup (you can disable Google Analytics if you want)
5. Click "Create project"

## Step 2: Enable Firestore Database

1. In your Firebase project, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Select "Start in test mode" (for now - we'll secure it later)
4. Choose a location closest to your users (e.g., `us-central`, `europe-west`)
5. Click "Enable"

## Step 3: Get Your Firebase Configuration

1. In Firebase Console, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>) to add a web app
5. Register your app with a nickname (e.g., "Quirozen Web")
6. Copy the `firebaseConfig` object that appears

## Step 4: Configure Environment Variables

1. In your project root, create a `.env` file (copy from `.env.example`)
2. Add your Firebase configuration values:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Important**: Replace the values with your actual Firebase config values.

## Step 5: Set Up Firestore Security Rules

1. In Firebase Console, go to "Firestore Database"
2. Click on the "Rules" tab
3. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reservations collection
    match /reservations/{reservationId} {
      // Allow read for anyone (users need to read their reservations by code)
      allow read: if true;
      
      // Allow create for anyone (users can make reservations)
      allow create: if true;
      
      // Allow update only if the code matches (or for admin operations)
      // Note: This is basic - in production, add admin authentication
      allow update: if true;
      
      // Allow delete for anyone (users can cancel their reservations)
      allow delete: if true;
    }
    
    // Availability collection
    match /availability/{availabilityId} {
      // Allow read for anyone (users need to check available dates/times)
      allow read: if true;
      
      // Allow create/update/delete for anyone (admin operations)
      // Note: In production, restrict this to admin users only
      allow create: if true;
      allow update: if true;
      allow delete: if true;
    }
  }
}
```

4. Click "Publish"

**Note**: These rules allow public access. For production, consider implementing:
- Admin authentication
- Code-based verification for updates/deletes
- Rate limiting

## Step 6: Test the Connection

1. Run your development server: `npm run dev`
2. Go to the Reservas section
3. Try creating a test reservation
4. Check Firebase Console > Firestore Database to see if the reservation appears

## Step 7: Deploy Configuration

When deploying (e.g., to Vercel, Netlify, etc.), make sure to add your environment variables in the platform's settings:

- Vercel: Project Settings > Environment Variables
- Netlify: Site Settings > Environment Variables

## Free Tier Limits

Firebase Free Tier (Spark Plan) includes:
- **50K reads/day**
- **20K writes/day**
- **20K deletes/day**
- **1 GB storage**

This should be sufficient for small to medium businesses. Monitor usage in Firebase Console.

## Troubleshooting

### "Missing or insufficient permissions" error
- Check Firestore security rules
- Ensure rules are published

### "Quota exceeded" error
- You've hit the free tier limits
- Consider upgrading to Blaze Plan (pay-as-you-go)

### Environment variables not working
- Ensure variables start with `VITE_`
- Restart your dev server after adding variables
- Check that `.env` file is in the project root

## Production Security Recommendations

For production, improve security:

1. **Add Admin Authentication**:
   - Use Firebase Authentication
   - Create admin users
   - Update security rules to check admin status

2. **Implement Rate Limiting**:
   - Use Cloud Functions
   - Limit reservation creation per IP/email

3. **Code Validation**:
   - Verify reservation codes before allowing updates/deletes

4. **Backup Strategy**:
   - Set up automated backups
   - Export data regularly

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Support](https://firebase.google.com/support)
