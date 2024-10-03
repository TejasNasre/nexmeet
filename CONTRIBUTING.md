# `Contributing`

When contributing to this repository, please first discuss the change you wish to make via issue with the maintainers of this repository before making a change.

Please note we have a code of conduct, please follow it in all your interactions with the project.

## `Build and Run`

- Before creating a Pull Request, make sure the project builds and runs successfully.
- Run the following commands to build the project:

  ```bash
  npm run build
  ```

- To run the built project:

  ```bash
  npm start
  ```

- Make sure to only open a Pull Request after the above commands run successfully, without any errors.

# `MAKE PR TO DEV BRANCH ONLY`

## `Pull Request Process`

- Ensure any install or build dependencies are removed before the end of the layer when doing a build. Add only relevant files to commit and ignore the rest to keep the repo clean.
- Update the [README.md](/README.md) with details of changes to the interface, this includes new environment
  variables, exposed ports, useful file locations and container parameters.
- You should request review from the maintainers once you submit the Pull Request.

## `Instructions`

- **Create a New Branch:**

  - Create a new branch to work on using the command:

    ```bash
    git checkout -b <branch_name>
    ```

- **Install Dependencies:**

  - Navigate to the project directory and install the dependencies using:

    ```bash
    npm install
    ```

    or

    ```bash
    yarn install
    ```

- **Start the Development Server:**

  - Start the development server by running:

    ```bash
    npm run dev
    ```

    or

    ```bash
    yarn dev
    ```

- **Database and Authentication Setup:**

  - Refer to the [LEARN.md](/LEARN.md) file for detailed instructions on setting up your database and authentication.

- **You're Good to Go:**

  - With the setup complete, you're ready to start exploring.

## `Upcoming Features`🎉

- [ ] add events to the google calendar
- [ ] add event reminders
- [ ] add event notifications
- [ ] add event feedback
- [ ] add event likes
- [ ] add event comments
- [ ] add event chat
- [ ] add event attendees

## `Contributing Guidelines`

- Always create a new branch for your changes and make a pull request to the `dev` branch.
- Make sure to follow the coding standards and conventions.
- Make sure to add comments to your code.
- Make sure to update the [README.md](/README.md) with details of changes to the interface.
- Make sure to update the [LEARN.md](/LEARN.md) file with any new instructions.
- Make sure to update the [CONTRIBUTORS.md](/CONTRIBUTORS.md) file with your name and GitHub profile link.
- Make sure to update the [LICENSE](/LICENSE) file with your name and email address.
