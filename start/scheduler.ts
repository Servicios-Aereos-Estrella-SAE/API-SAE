import scheduler from 'adonisjs-scheduler/services/main'

// scheduler.command('inspire').everyFiveSeconds()
scheduler.command('sync:assistance').cron('* * * * *')
