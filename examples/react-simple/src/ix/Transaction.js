import React, {useState} from "react"
import * as sdk from "@onflow/sdk"
import {signingFunction} from "./utils/signing-function.js"

export const Transaction = () => {
  const [result, setResult] = useState(null)

  const run = async () => {

    const acctResponse = await sdk.send(await sdk.pipe(await sdk.build([
      sdk.getAccount("f8d6e0586b0a20c7")
    ]), [
      sdk.resolve([
        sdk.resolveParams,
      ]),
    ]), { node: "http://localhost:8080" })

    const seqNum = acctResponse.account.keys[0].sequenceNumber

    const response = await sdk.send(await sdk.pipe(await sdk.build([
      sdk.params([sdk.param("foo", "rawr")]),
      sdk.payer(sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0)),
      sdk.proposer(sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0, seqNum)),
      sdk.transaction`transaction { prepare(acct: AuthAccount) {} execute { log("Hello") } }`,
      sdk.authorizations([sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0)]),
    ]), [
      sdk.resolve([
        sdk.resolveParams,
        sdk.resolveAccounts,
        sdk.resolveSignatures,
      ]),
    ]), { node: "http://localhost:8080" })

    setResult(await sdk.decodeResponse(response))
  }

  return (
    <div>
      <button onClick={run}>
        Run <strong>Transaction</strong>
      </button>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}
