let get = (element) => document.querySelector(element);
var x ;



var socket = io.connect('http://10.3.141.244:9400/client-monitor',);


// Quand on reçoit un message, on l'insère dans la page
// socket.on('message', function (data) {
//     console.log(data.content)
//     get('#message').innerHTML = data.content;

// })

const vueApp = new Vue({
    el: '#main',
    selectedItem: null,
    data: {
        requests : 0,
        timing : 0,
        faceCount : 0,
        persons: [],
        section: '',
        step1: true,
        intents: []
    },
    methods: {
       
       
        loaded(){
            
            console.log("enter in loaded function")
            self = this
            socket.on('speech-requests-count', function (data) {
                console.log("Rasa requests count comming....")
                self.requests += 1;
                console.log(self.requests)
            });

            socket.on('response-time-average', function (data) {
                console.log("Rasa requests time average comming....")
                self.timing = data;
                console.log(self.timing)
            });

            socket.on('user-request', function (data) {
                console.log("Requests user...." + data)
                self.timing = data[2]
                self.intents.push(data);
                console.log(self.intents)
            });

            socket.on('face-requests-count', function (data) {
                console.log("Face request count comming....")
                self.faceCount += 1;
                console.log(self.faceCount)
            });

        },
    
    },
    mounted: function(){
        this.loaded()
        // this.change()
    }
});



let turnAllFalse = function(){
    self.step1= false;
}
