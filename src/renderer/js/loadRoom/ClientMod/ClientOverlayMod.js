import ClientMod from "./ClientMod.js";

export default class ClientOverlayMod extends ClientMod
{
    constructor(config)
    {
        super(config);

        this.on("receiveData", (data) =>
        {
            console.log("receiveData from OverlayMod ", data);
        });
    }
}