import { Consumer } from 'sqs-consumer'
import bunyan from 'bunyan'

const queueUrl = 'https://sqs.eu-west-1.amazonaws.com/account-id/queue-name'

const logger = bunyan.createLogger({
  name: 'queue-drainer',
  serializers: bunyan.stdSerializers
})

async function handleMessage (message) {
  logger.info(message)
}

const app = Consumer.create({ queueUrl, handleMessage })

app.on('error', (err) => {
  logger.error({ err }, 'generic error')
})

app.on('processing_error', (err) => {
  logger.error({ err }, 'processing error')
})

app.start()
