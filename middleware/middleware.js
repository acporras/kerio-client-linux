export default (context) => {
  const { app } = context
  if (app) {
    console.log('Running Middleware')
  }
}
