# AskUs Application

AskUs is available only on mobile iOS devices<br>
Get the iOS App here :
[AskUs on AppStore](https://itunes.apple.com/us/app/askus/id1102293993)

Please check the website at :
[AskUs Website](https://askus-app.herokuapp.com/#/)

AskUs application, helps people to share post and ask the community to make a choice between 2 elements of a post by voting.

AskUs uses Facebook for user login. User can check if their friends are using the application and check their posts<br>

![AskUs Pictures](Documentations/readme-app-pictures.png?raw=true "AskUs Pictures")

## Technologies Stack
---

* FRONT
	* **Ionic** Framework	
  * **Cordova**
	* **AngularJS** Framework
	* **Sass** for CSS
* BACK
	* **Node.js/Express** Server
	* **Firebase** Database
* OTHER
	* **Facebook** Application and API
	* **AWS S3** CDN
	* **Gulp** as Task runner for Js, Sass and HTML files

## Features
---
* Login with Facebook
* See all recent posts
* Filter posts by categories
* User page
* Post page
* Facebook friends list page
* Comments on post page
* Add a post page, with access to the device camera and photo library
* My votes page


## Local installation
---

### Third Party Applications

You need to create a new facebook application [Facebook Developers](https://developers.facebook.com/)

The application uses Firebase for Database and Facebook login, You need to create a Firebase application and enable the facebook login. [Firebase](https://www.firebase.com/)

An AWS S3 CDN is used to store the pictures. [AWS](https://console.aws.amazon.com)

### Configuration file

You need to add a configFile.json file in the root folder.

You can find an example of the file in the documentations folder: [configFile.json](Documentations/configFile.json.example.json).

Then run this command to use it: `gulp config-files`

### Run the application

Install packages: `npm install`

Run: `ionic serve -p 8101`

Watch, copy and compile SCSS, JS & HTML files: `gulp watch`

Build App for iOS and Android: `ionic build (ios / android)`

### Server

The application needs a server for signing AWS posting pictures requests.
It is also required when a user wants to delete his account and posts.

Check the App server here :
[AskUs Server](https://github.com/renandeswarte/askus-app-api)

### Plugins and dependencies

Install the ios 4.1.0 version `cordova platform add ios@4.1.0`

List of all the plugins

* "cordova-plugin-console",
* "cordova-plugin-whitelist",
* "ionic-plugin-keyboard",
* "cordova-plugin-file", "~4.1.1"
* "cordova-plugin-file-transfer", "~1.5.0"
* "cordova-plugin-camera", "~2.1.0"
* "com.bez4pieci.cookies", "https://github.com/bez4pi/Phonegap-Cookies-Plugin.git" />
* "cordova-plugin-google-analytics", "~0.8.1"
* "cordova-plugin-device", "~1.1.1"
* "cordova-plugin-statusbar", "~2.1.2"
* "cordova-plugin-splashscreen", "~3.2.1"
* "cordova-plugin-inappbrowser", "~1.3.0"


