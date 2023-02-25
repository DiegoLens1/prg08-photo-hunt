const featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded);
const objectiveDiv = document.getElementById("objective")
const instructions = document.getElementById("instructions")
let objective = ""
const randomiserArray = ["dog", "cat", "bird"]
let score = 0
const scoreDiv = document.getElementById("score")
const input = document.getElementById("file")
const img = document.getElementById("output")
const test = document.getElementById("test")
const startGamebtn = document.querySelector("#startGame")
const retrybtn = document.getElementById("retry")
const options = { numLabels: 3 }
const classifier = featureExtractor.classification(img, options)

startGamebtn.addEventListener("click", () => randomizeObjective());
retrybtn.addEventListener("click", () => restart());

function randomizeObjective() {
    objective = randomiserArray[Math.floor((Math.random() * 3))]
    startGame()
}

function startGame() {
    if(startGamebtn) startGamebtn.remove()
    if(instructions) instructions.remove()

    objectiveDiv.innerHTML = "Take a picture of a " + objective
    speak("Take a picture of a " + objective)
    objectiveDiv.style.display = "block"
    scoreDiv.style.display = "block"    

    input.style.display = "inline-block"
}

function restart() {
    randomizeObjective()
    img.style.display = "none"
    retrybtn.style.display = "none"
    input.value = null
    input.style.display = "inline-block"
    console.log(img.src)
    URL.revokeObjectURL(img.src)
    img.src = ''
}
function fileAdded() {
    input.style.display = "none"
    img.src = URL.createObjectURL(event.target.files[0])
    img.style.display = "inline-block"
    classify()
    retrybtn.style.display = "inline-block"
}

function classify() {
    classifier.classify(img, (err, result) => {
        if(err) console.log(err)
        if(result[0].label == objective){
            objectiveDiv.innerHTML = "Correct! I am "+result[0].confidence.toString().substring(2,4)+"% positive that that is a "+result[0].label+"."
            speak("Correct! I am "+result[0].confidence.toString().substring(2,4)+"% positive that that is a "+result[0].label+".")
            score++
            scoreDiv.innerHTML = "Score: "+score
        }else{
            objectiveDiv.innerHTML = "That is not a "+objective+". I am "+result[0].confidence.toString().substring(2,4)+"% positive that that is a "+result[0].label+"."
            speak("That is not a "+objective+". I am "+result[0].confidence.toString().substring(2,4)+"% positive that that is a "+result[0].label+".")
        }
    })
}

let synth = window.speechSynthesis

function speak(text) {
    if (synth.speaking) {
        synth.cancel()
        setTimeout(function(){
            synth.speak(text)
        }, 250); 
    }
    if (text !== '') {
        let utterThis = new SpeechSynthesisUtterance(text)
        synth.speak(utterThis)
    }
}

function loadCustomModel() {
    featureExtractor.load('./model/model.json')
    console.log("Custom model loaded")
}

// When the model is loaded
function modelLoaded() {
  console.log('Model Loaded!');
  loadCustomModel()
}