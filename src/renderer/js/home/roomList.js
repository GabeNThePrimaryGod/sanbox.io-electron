const { remote } = require("electron");
const env = remote.getGlobal("env");

import { requestManager } from "../requestmanager/requestManager.js";

export default class RoomList
{
    constructor(mainDiv, loadRoomRedirect, notyf) 
    {
        this.mainDiv = mainDiv;
        this.notyf = notyf;

        window.connectRoom = (roomUID) =>
        {
            console.log(roomUID);

            env.openedRoomUID = roomUID;
            loadRoomRedirect.click();
        };

        window.refreshRoomList = () => 
        {
            this.refresh();
        }

        this.refresh();
    }

    getData()
    {
        return new Promise((resolve, reject) =>
        {
            requestManager.get('/rooms')
            .then((response) => 
            {
                return response.json();
            })
            .then((responseData) => 
            {
                console.log("rooms response data", responseData);
                
                if(responseData.status === "OK")
                {   
                    resolve(responseData.data);
                }
                else
                {
                    if(notif) notyf.error(`can't get rooms data`);
                    reject(`can't get rooms data`);
                }
            })
            .catch((err) => { throw err; });
        });
    }

    async refresh()
    {
        try
        {
            const data = await this.getData();
        }
        catch(err)
        {
            
        }
        
        const data = await this.getData();

        let tab =
        `
    
        <div class="recipes container grey-text text-darken-1">
    
        
      
       
        <div class="center">
        <button class="waves-effect waves-light btn" onclick="refreshRoomList()">Refresh</button>
       
        <table id="roomList" class="tftable" border="1">
        <tr>
            <th>Nom</th>
            <th>Mod gameplay</th>
            <th>Mod overlay</th>
            <th>Mod environment</th>
            <th>Joueurs</th>
            <th>Rejoindre</th>
        </tr>
        `;

        for(const room of data.rooms)
        {
            tab += 
            `
            <tr>
                <td>${room.name}</td>
                <td>${room.mods.gameplay.name}</td>
                <td>${room.mods.overlay.name}</td>
                <td>${room.mods.environment.name}</td>
                <td>${room.playersCount}/${room.size}</td>
                <td><a type="button"onclick="connectRoom('${room.UID}')" class="btn-floating btn-small waves-effect waves-light blue"data-target="side-form"><i class="material-icons">done</i></a></td>
                
            </tr>
            `;
        }

        tab += "</table></div>";

        this.mainDiv.innerHTML = tab;
    }
}