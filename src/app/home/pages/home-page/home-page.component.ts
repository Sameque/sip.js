import { Component, OnInit } from '@angular/core';
import { Invitation } from 'sip.js/lib/api/invitation';
import { Inviter } from 'sip.js/lib/api/inviter';
import { Registerer } from 'sip.js/lib/api/registerer';
import { UserAgent } from 'sip.js/lib/api/user-agent';
import { UserAgentOptions } from 'sip.js/lib/api/user-agent-options';
import { URI } from 'sip.js/lib/grammar/uri';
import { SimpleUser, SimpleUserDelegate, SimpleUserOptions } from "sip.js/lib/platform/web";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  
  private userAgent: UserAgent
  private audio:HTMLAudioElement = (document.getElementById("remoteAudio")  as HTMLAudioElement);
  private video:HTMLVideoElement = (document.getElementById("remoteVideo")  as HTMLVideoElement);

  constructor() { 
    
    const server = "wss://maisvoip471.ipboxcloud.com.br:9911/ws";
    const aor = "sip:6057@stun.ipbox.com.br:3478";
    const uri = UserAgent.makeURI(aor);

    const authorizationPassword = 'HkfSCgLQ';
    const authorizationUsername = '6057';
    const displayName = 'Demo SIP';
    let simpleUser: SimpleUser;

    const transportOptions = {
      server
    };

    const delegate: SimpleUserDelegate = {
      onCallReceived: async () => {
        console.log('Incoming Call!');
        await simpleUser.answer();
      }
    };

    const simpleUserOptions: SimpleUserOptions = {
      aor,
      delegate: delegate,
      media: {
        local: {
          video: this.video
        },
        remote: {
          video: this.video,
          audio: this.audio
        }
      }
    };

    const userAgentOptions: UserAgentOptions = {
      authorizationPassword,
      authorizationUsername,
      displayName,
      delegate: {
        onInvite: this.onInvite,
      },
      transportOptions:transportOptions,
      uri:uri,
      // sessionDescriptionHandlerFactoryOptions: {
      //   // constraints: { audio: { deviceId: 'default'},
      //   //   video: false
      //   // },
      //   constraints: { audio: true, video: false },
      //   alwaysAcquireMediaFirst: true,
      //   iceCheckingTimeout: 500
      // }
    };

    simpleUser = new SimpleUser(server, simpleUserOptions);
    simpleUser.connect();
    simpleUser.register();

    this.userAgent = new UserAgent(userAgentOptions);
    const registerer = new Registerer(this.userAgent);

    this.userAgent.start().then(() => {
      registerer.register();
    });
  }

  ngOnInit(): void {
  }

  public async login(): Promise<void>{
    const server = "wss://maisvoip471.ipboxcloud.com.br:9911/ws";
    const uri = UserAgent.makeURI("sip:6057@stun.ipbox.com.br:3478");
    const transportOptions = {
      server: server
    };

    const userAgentOptions: UserAgentOptions = {
      authorizationPassword: 'HkfSCgLQ',
      authorizationUsername: '6057',
      delegate: {
        onInvite: this.onInvite,
      },

      transportOptions:transportOptions,
      uri:uri
    };
    this.userAgent = new UserAgent(userAgentOptions);
    const registerer = new Registerer(this.userAgent);

    this.userAgent.start().then(() => {
      registerer.register();
      
    });
  }

  public async call(): Promise<void>{

    const htmlElementPhone = (document.getElementById("phone") as HTMLInputElement);
    const phone = htmlElementPhone.value;
    const uri = `sip:${phone}@stun.ipbox.com.br:3478`;

    this.userAgent.start().then(() => {
      const target = (UserAgent.makeURI(uri) as URI);
      const inviter = new Inviter(this.userAgent,target);

      inviter.invite();
      console.log(`Call: ${phone}\n\n URI:${uri}`);

    }).catch(( error:Error)=>{
      console.log(`Call: ${phone}\n\n URI:${uri}\n\nerror`);
    });

  }

  public async onInvite(invitation: Invitation) {
    // this.received(invitation);
    invitation.accept();
    console.log("----------------------------------------------onInvite--------------------------------------------")
    console.log(invitation);
  }
}