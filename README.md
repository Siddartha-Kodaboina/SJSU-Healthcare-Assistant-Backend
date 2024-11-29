# Online Doctor's Portal

A Single page web app with dashboard  where people can pick the date and time and fix an appointment. A doctor can review his appointments and prescribe medicine to a Patient from his dashboard.

#### Features :
* Online appointment making
* Patients Database
* Review appointments
* Prescribe medicine for each patient
* Responsive UI
* Single Page Application (SPA)
* User can get an appointment of his/her desire day.
* A dashboard is available for authenticated admin.
* Admin can add see all the appointments
* Admin can change appointment’s status to notify the clients about progress.

### Front-end Thechnology : 
* React.js
* Bootstrap4
* CSS3
* Context API

### Back-end Technology
* Node.js
* Express.js
* MongoDB

<hr>

## Setup Instructions

### Versions

Node: 20.5.1

npm: 9.8.0

### Configurations
create `.env file

```bash
DB_USER="mongo_db_user"
DB_PASS="mongo_db_pwd"
MONGODB_URL_STRING="mongo_db_database_str_url"
DB_NAME="mongo_db_name"
OPENAI_API_KEY="your_open_ai_api_key"
```

> ### Install
``` 
 npm install -y
```
> ### Build webpack
``` 
 npm run build
```
> ### Dev Server

``` 
 npm run start:dev
```
