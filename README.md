## Valex

With Valex companies can create benefit cards for their employees with security and agility

Features

- [x] Crate new card

- [x] Activate card

- [ ] Transaction and balance visualization

- [x] Recharge

- [ ] Payment

#### BONUS

- [ ] Block card

- [ ] Unblock card

- [ ] Online shopping

- [ ] Vitual card features

## Endpoints

### All following need API key

<details>
    <summary>
        <strong >Authorization</strong>
    </summary>

```json
{
  "headers": {
    "x-api-key": "zadKLNx.DzvOVjQH01TumGl2urPjPQSxUbf67vs0"
  }
}
```

- it returns <strong">401</strong> for empty auth;

- it returns <strong>404</strong> if no company has this key

</details>
   <details>
            <summary>
                <strong>POST</strong> /cards
            </summary>
        send body request like this:

```json
{
  "employeeId": 1,
  "type": "restaurant"
}
```

- type accepts only `'groceries', 'restaurants', 'transport', 'education', 'health'`

- it return an object like this:

```json
{
  "number": "6706263694181508",
  "employeeId": 1,
  "cardholderName": "Fulano R Silva",
  "securityCode": "026",
  "expirationDate": "04/27",
  "isVirtual": false,
  "isBlocked": true,
  "type": "health"
}
```

- it returns status <strong>201</strong> for succes

- it return status <strong>400</strong> if employee already has this card type

- it return status <strong>403</strong> if employee not from this company

 </details>
   <details>
            <summary>
                <strong>POST</strong> /cards/NUMBER/activate
            </summary>

- Change NUMBER to card number

        send body request like this:

```json
  {
    "password": "1234",
    "cvc": "123"
  }
  ```

- password is always four number digits string

- cvc is always three number digits string

- it returns status <strong>200</strong> for succes

- it return status <strong>401</strong> if cvc is wrong

- it return status <strong>404</strong> if number doesn't match a card number

- it return status <strong>409</strong> if it's already activated

 </details>

   <details>
            <summary>
                <strong>POST</strong> /cards/NUMBER/recharge
            </summary>

- Change NUMBER to card number

        send body request like this:

```json
  {
    "amount": 50
  }
  ```

- amount must to be a integer positive number

- it returns status <strong>200</strong> for succes

- it return status <strong>403</strong> if is expired

- it return status <strong>404</strong> if number doesn't match a card number

 </details>

## Technologies

<div style="display: flex; gap: 10px; height: 40px;">
  <a title="TypeScript" href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer"> 
      <img src="https://user-images.githubusercontent.com/85591297/157519943-9da08e53-e59d-450a-8b0d-81af17974fd0.svg" alt="TypeScript" height="40"/>
  </a>
  <a title="Node JS" href="https://nodejs.org" target="_blank" rel="noreferrer"> 
      <img style="background: white;" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" height="40"/> 
  </a>
  <a title="Express JS" href="https://expressjs.com/" target="_blank" rel="noreferrer"> 
      <img style="background: white;" src="https://www.vectorlogo.zone/logos/expressjs/expressjs-icon.svg" alt="expressjs" height="40"/> 
  </a>
  <a title="Postgre" href="https://www.postgresql.org/" target="_blank" rel="noreferrer"> 
      <img style="background: green;" src="https://user-images.githubusercontent.com/85591297/157520309-59a18d2e-ee4d-433c-8990-12fdbba37a0d.svg" alt="Postgre" height="40"/> 
  </a>
</div>

## Requirements

### [npm](https://www.npmjs.com/)

<details>
    <summary>install npm</summary>

```bash
wget -qO- <https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh> | bash

## Or this command
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

# Close and open terminal
nvm install --lts
nvm use --lts
# Verify node version
node --version # Must show v14.16.1
# Verify npm version
npm -v
```

</details>

### [postgreSQL](https://www.postgresql.org/)

<details>
    <summary>install postgres</summary>

```bash
sudo apt install postgresql postgresql-contrib
```

</details>

## How to run

1. Clone this repository
2. Install dependencies

```bash
npm i
```

3. Create database with given script

- open terminal in ./src/database and run

```bash
bash ./create-database
```

4. set your .env file

5. Run the project with

```bash
npm run start (deploy)
```

6. Run the project in development mode (nodemon)

```bash
npm run start:dev
```
