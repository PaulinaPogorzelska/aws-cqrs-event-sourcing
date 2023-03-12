# Serverless CQRS Event sourcing test

## Deploying the app

1. Make sure that you created your account on [aws](https://aws.amazon.com/)

2. After creating the app get your `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` and add them into your env (for example by adding them to `.zshrc` file)

3. Run 
```bash
 yarn
```

or 

```bash
npm i
```
(preferably `yarn`)

4. Run 
```bash
yarn sls deploy --stage=dev
```

or 

```bash
npm run sls deploy --stage=dev
```

