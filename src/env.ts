import bluebird from 'bluebird'
import config from 'config'
import mongoose from 'mongoose'

//////////////////////////// MONGOOSE ///////////////////////////

mongoose.Promise = bluebird
mongoose
  .connect(config.get<string>('MONGO_URI'), {
    connectTimeoutMS: 3000,
    keepAlive: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to mongodb.')
  })
  .catch(() => {
    console.log('Failed connecting to mongodb.')
  })
const mongodb = mongoose.connection

export { mongodb }
