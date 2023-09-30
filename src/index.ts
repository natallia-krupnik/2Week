import{ app } from "./settings"
import {runDb} from "./db/db";

const port = process.env.PORT || 3001

//app.listen(port, (): void => {
 //   console.log(`App started on ${port} port`)
//})

const startApp = async () => {
    await runDb()
    app.listen(port, (): void => {
        console.log(`App started on ${port} port`)
    })
}

startApp()

export { app }
