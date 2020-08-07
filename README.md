# location-scouter

A web app to help Photographers and Cinematographers find and save locations for
projects.

## Developers

### Requirements

Location Scouter requires a couple of things before development can begin. These
include:

1. [Node.js](https://nodejs.org/en/)
2. [npm](https://www.npmjs.com/)
3. [yarn](https://yarnpkg.com/)
4. [Firebase CLI](https://firebase.google.com/docs/cli)
5. Access to the Location Scouter Firebase Project

After you have installed/obtained all of the above, you can now clone or fork
the repository.

Finally, you will now need the Firebase configuration. This can be obtained by:

1. Go to the Location Scouter Firebase project within the
   [Firebase Console](https://console.firebase.google.com)
2. Go to the settings page
3. Select the **General** tab
4. Scroll down to the **Your Apps** section
5. Select the **react-website** web app
6. Select the **Config** Firebase SDK Snippet
7. Copy the values
8. Create a file named **.env** in the root directory of the repo
9. Following the format of the **.env.sample** file, paste the values into the
   newly created **.env** file

### Running locally

1. Open one terminal and run `yarn build`
2. Within another terminal run `firebase serve --only hosting`
3. Open [localhost:5000](localhost:5000) within your browser
4. Make changes and run `yarn build` with every new change before refreshing
   your browser
