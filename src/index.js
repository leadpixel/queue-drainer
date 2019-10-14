import { Consumer } from 'sqs-consumer'
import bunyan from 'bunyan'

const logger = bunyan.createLogger({
  name: 'queue-drainer',
  serializers: bunyan.stdSerializers
})

const queueUrl = process.env.QUEUE || null

if (!queueUrl) {
  logger.fatal({ queueUrl }, 'no queue url provided, please set QUEUE')
  process.exit(1)
}

async function handleMessage (message) {
  const messageId = message.MessageId

  try {
    const body = JSON.parse(message.Body)
    logger.info({ messageId, body }, 'parsed json')
  } catch (e) {
    const body = message.Body
    logger.info({ messageId, body }, 'received message')
  }
}

const app = Consumer.create({ queueUrl, handleMessage })

app.on('error', (err) => {
  logger.error({ err }, 'generic error')
  process.exit(1)
})

app.on('processing_error', (err) => {
  logger.error({ err }, 'processing error')
  process.exit(1)
})

app.start()
