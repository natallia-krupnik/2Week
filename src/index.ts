import {runDb} from "./db/db";
import {app} from "./settings";

const port = process.env.PORT || 4000

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

