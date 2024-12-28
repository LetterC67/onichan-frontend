# onichan

this is this repo containing the frontend for onichan webforum. the backend is available [here](https://github.com/LetterC67/onichan-backend).

the web forum is fully functional equiped with essential features:
- users creation and profile customization
- users auth essentials (password, avatar, email modifications)
- role-based access control
- post categories
- post reactions
- post searching
- notification system
- support for reporting inapproriate posts / admins can remove them

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

build the docker image:
  ```sh
  docker build -t onichan-frontend .
  ```

run the docker container:
  ```sh
  docker run -p 80:80 onichan-frontend
  ```

the application will be available at `http://localhost`, or whatever port you desire.


## acknowledgement 

the frontend uses svgs sourced from [here](https://www.svgrepo.com/collection/cube-action-icons/).