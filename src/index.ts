import{ app } from "./settings"

const port = 3001

app.listen(port, (): void => {
    console.log(`App started on ${port} port`)
})

export { app }
