namespace SimpleFSharp


open Amazon.Lambda.Core

open System


// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[<assembly: LambdaSerializer(typeof<Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer>)>]
()

[<CLIMutable>]
type Payload = { name: string }

type Function() =
    member __.FunctionHandler (payload: Payload) (_: ILambdaContext) =
        match payload.name with
        | null -> String.Empty
        | _ -> payload.name.ToUpper()
