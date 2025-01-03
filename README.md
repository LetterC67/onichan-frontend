# onichan

the forum is accessible at: https://onichan.zapto.org/

this is this repo containing the frontend for onichan webforum. the backend is available [here](https://github.com/LetterC67/onichan-backend).

the frontend communicates with backend through rest api.

the web forum is fully functional, equiped with essential features:
- users creation and profile customization
- users auth essentials (password, avatar, email modifications)
- role-based access control
- post categories
- post reactions
- post searching
- notification system
- support for reporting inapproriate posts / admins can remove them

currently, this frontend supports both pc and mobile, but more optimized for pc.

## installation

clone the repo:
```sh
git clone https://github.com/LetterC67/onichan-frontend.git
cd onichan-frontend
```

install the dependencies:
```sh
npm i
```

## run
don't forget to setup the backend before running. edit the configs in `.env` file.

run dev server:
```sh
npm run dev
```

or you can build the project:
```sh
npm run build
```

## docker setup
alternatively, one can run the frontend as a docker container. make sure you have docker installed. 

firstly, config the domain in `default.conf` and `.env` file: replace all instances of `onichan.zapto.org` with your domain. 

build & run the docker containers:
  ```sh
  docker compose up -d --build
  ```

the application will then be available at `https://your-domain`.


## acknowledgement 

the frontend uses svgs sourced from [here](https://www.svgrepo.com/collection/cube-action-icons/).