/*eslint-env browser*/
window.addEventListener('load', initiate, false);

var fileInput = null ; 
var data = null ;
var countSentences;
var listInput = null;
var hedgesboosters = null;

var finalData;
var logData = "";
var sentenceClicked = null;

var listYears = [2010,2011];
var listLocations = ["Abstract","Conclusion"];
var listTypes = ["inf. stats + interviews","Inf. stats"];
var listOfSentences = [];
var listOfKeywords = new Array();


var nbOfExpressionsFound = 0;
var nbOfSentencesFound = 0;

var expressionClicked = -1
var previousExpressionClicked = -1
var sentenceClicked = -1
var previousSentenceClicked = -1

var selectedText = ""

var coderName = null ;
var possibleCoderNames = ["Athos","Aramis","Porthos"];

var selectionStartIndex = -1 ;

var debugMode = false 

var nbOfClicks = 0



initiate();

function clearSelection() {
    if(document.selection && document.selection.empty) {
        document.selection.empty();
    } else if(window.getSelection) {
        var sel = window.getSelection();
        sel.removeAllRanges();
    }
    
}

function customDoubleClick(e){
    //e.preventDefault();
    clearSelection();
    /*if(expressionClicked==-1 || sentenceClicked == -1){
        return false;
    }
    else{
        nbOfClicks = 2;
    }*/
}

function getCoderName (filename){
    for(var i = 0 ; i < possibleCoderNames.length ; i++){
        if(filename.indexOf(possibleCoderNames[i])!= -1){
            coderName = possibleCoderNames[i] ;
            //console.log("Coder name = "+coderName)
            return ;
        }
    }
    
}

$(window).scroll(function(){
  $('#scroll').toggleClass('scrolling', $(window).scrollTop() > $('#mainPart').offset().top);
});

window.oncontextmenu = function (e)
{
    e.preventDefault();
    clearSelection();
    
    
    //console.log("CONTEXT MENU");
    //console.log("Body double-clicked with expressionClicked ="+expressionClicked+" and sentenceClicked = "+sentenceClicked)
    if(expressionClicked==-1 || sentenceClicked == -1){
        return false;
    }
    else{
        for( var i = 0 ; i < listOfSentences.length ; i++){
            //console.log("sentenceClicked = "+sentenceClicked+" listOfSentences[i].sentenceID = "+ listOfSentences[i].sentenceID)
            if(sentenceClicked == listOfSentences[i].sentenceID){
                //console.log("Sentence before click");
                //console.dir(listOfSentences[i])
                listOfSentences[i].updateSentenceAfterRightClick();
                //console.log("Sentence after click");
                //console.dir(listOfSentences[i])
                //console.log("-------------")
            }
        }
        previousExpressionClicked = expressionClicked ;
        expressionClicked=-1;
        previousSentenceClicked = sentenceClicked
        sentenceClicked=-1;
    }
    return false;     // cancel default menu
}

function fakeDoubleClick(){
    for( var i = 0 ; i < listOfSentences.length ; i++){
        //console.log("Simple clicked = "+sentenceClicked+" listOfSentences[i].sentenceID = "+ listOfSentences[i].sentenceID)
        if(previousSentenceClicked == listOfSentences[i].sentenceID){
            //console.log("Sentence before click");
            //console.dir(listOfSentences[i])
            listOfSentences[i].updateSentenceAfterFakeDoubleClick();
            //console.log("Sentence after click");
            //console.dir(listOfSentences[i])
            //console.log("-------------")
        }
    }
}

function selectionEvent(){
    //console.log("Handle selected text 0 with selected text = "+selectedText+" and selectionIndex = "+selectionStartIndex)
    /*var sel = window.getSelection()
    selectedText = sel.toString();*/
    if(selectedText!= ""){
        //console.log("Selection event non empty")
        if(sentenceClicked == -1){
            //console.log("Selection event cancelled because not on a sentence element")
            return;
        }
        else{
            for( var i = 0 ; i < listOfSentences.length ; i++){
                //console.log("sentenceClicked = "+sentenceClicked+" listOfSentences[i].sentenceID = "+ listOfSentences[i].sentenceID)
                if(sentenceClicked == listOfSentences[i].sentenceID){
                    //console.log("Selection event -- sentence found")
                    //console.log("Sentence before click");
                    //console.dir(listOfSentences[i])
                    listOfSentences[i].handleSelectedText();
                    //console.log("Sentence after click");
                    //console.dir(listOfSentences[i])
                    //console.log("-------------")
                }
            }
            previousExpressionClicked = expressionClicked ;
        expressionClicked=-1;
        previousSentenceClicked = sentenceClicked
        sentenceClicked=-1;
        }
    }
    
}

function clickBody(){
    //console.log("Body clicked with expressionClicked ="+expressionClicked+" and sentenceClicked = "+sentenceClicked)
    //console.log("Simple click body")
    if(expressionClicked==-1 || sentenceClicked == -1){
        return;
    }
    else{
        for( var i = 0 ; i < listOfSentences.length ; i++){
            //console.log("sentenceClicked = "+sentenceClicked+" listOfSentences[i].sentenceID = "+ listOfSentences[i].sentenceID)
            if(sentenceClicked == listOfSentences[i].sentenceID){
                //console.log("Sentence before click");
                //console.dir(listOfSentences[i])
                listOfSentences[i].updateSentenceAfterClick();
                //console.log("Sentence after click");
                //console.dir(listOfSentences[i])
                //console.log("-------------")
            }
        }
        previousExpressionClicked = expressionClicked ;
        expressionClicked=-1;
        previousSentenceClicked = sentenceClicked
        sentenceClicked=-1;
    }
    
}

class Expression{
    constructor(w,type,grammarType,indexSentenceBegin,isSelectedText = false){
        this.isValid = false ;
        this.expression = w;
        this.indexSentenceBegin = indexSentenceBegin;
        this.indexSentenceEnd = indexSentenceBegin+this.expression.length-1;
        this.grammarType = grammarType;
        this.isHedge = false;
        this.isBooster = false;
        this.originalCategorization = type;
        this.hasFollower = false;
        this.expressionID = "e_"+nbOfExpressionsFound ;
        this.isSelectedText = isSelectedText;
        this.id = -1 ;
        nbOfExpressionsFound ++;
        //console.log("type = "+type)
        //var r = Math.floor(Math.random() * 2) + 1   
        /*if(type == "Booster"){
            this.isBooster = true;
        }
        else{
            this.isHedge = true;
        }*/
        /*if(r == 2){
            this.isBooster = true;
        }
        else{
            this.isHedge = true;
        }*/
    }
    
    
    getDataForCSV(){
        var type ;
        if(this.isHedge) type = "Hedge"
        else if(this.isBooster) type = "Booster"
        else type="None"
        return [this.expression,this.id,this.isValid,this.grammarType,this.originalCategorization,type]
    }
    
    getHTMLElement(){
        var item = document.createElement('span');
        //console.log("Expression's class init")
        //console.log("Expression's class this.isBooster = "+this.isBooster)
        if(this.isValid == false){
            //console.log("DEBUG NOT VALID")
            item.className = "can_highlight";
        }
        else if(this.isHedge){
            //console.log("DEBUG HEDGE")
            item.className = "highlight_hedge";
        }
        else if(this.isBooster){
            //console.log("DEBUG BOOSTER")
            item.className="highlight_booster"
        }
        else{
            //console.log("DEBUG ERROR")
        }
        //console.log("---------------")
        //console.dir(item);
        //console.log("---------------")
        item.innerHTML = this.expression;
        item.id = this.expressionID;
        item.onclick = function () {
            expressionClicked = this.id;
            //console.log("Simple click")
            //console.log("ELEMENT CLASSNAME BEFORE = "+this.className)
            if(this.className=="can_highlight"){
                this.className="highlight_hedge";
            }
            else if(this.className=="highlight_hedge"){
                this.className="highlight_booster";
            }
            else{
                this.className="can_highlight"
            }
            
            //console.log("ELEMENT CLASSNAME AFTER = "+this.className)
        }

        return item ;
    }
    
    getHTMLElementOriginal(){
        var item = document.createElement('span');
        //console.log("Expression's class init")
        //console.log("Expression's class this.isBooster = "+this.isBooster)
        if(this.isBooster){
            item.className = "highlight_booster";
            item.innerHTML = this.expression;
            item.id = this.expressionID;
            item.setAttribute("data-Type", "Booster");
            item.onclick = function () {
                expressionClicked = this.id;
                //If it was counted as not valid before, we assign it its current type
                if(this.className=="can_highlight"){
                    if(this.getAttribute("data-Type")=="Booster"){
                        this.className="highlight_booster";
                    }
                    else{
                        this.className="highlight_hedge";
                    }
                }
                else{
                    this.className="can_highlight"
                }
                /*if(this.className=="highlight_booster"){
                    this.className="can_highlight";
                }
                else{
                    this.className="highlight_booster";
                }*/
                //console.log(expressionClicked)
            };
            item.oncontextmenu = function(e){
                //console.log("CONTEXT EXPRESSION")
                expressionClicked = this.id;
                if(this.className=="can_highlight"){
                    return ;
                }
                if(this.className=="highlight_hedge"){
                    this.className="highlight_booster";
                    item.setAttribute("data-Type", "Booster");
                }
                else{
                    this.className="highlight_hedge";
                    item.setAttribute("data-Type", "Hedge");
                }
                /*if(this.className=="highlight_booster"){
                    this.className="highlight_hedge";
                }
                else{
                    this.className="highlight_booster";
                }*/
                //console.log("Expression's class = "+this.className)
                
            };
        }
        else{
            item.className = "highlight_hedge";
            item.innerHTML = this.expression;
            item.id = this.expressionID;
            item.onclick = function () {
                //console.log("THIS ID = "+this.id)
                expressionClicked = this.id;
                //If it was counted as not valid before, we assign it its current type
                if(this.className=="can_highlight"){
                    if(this.getAttribute("data-Type")=="Booster"){
                        this.className="highlight_booster";
                    }
                    else{
                        this.className="highlight_hedge";
                    }
                }
                else{
                    this.className="can_highlight"
                }
                /*if(this.className=="highlight_hedge"){
                    this.className="can_highlight";
                }
                else{
                    this.className="highlight_hedge";
                }*/
                //console.log(expressionClicked)
            };
           item.oncontextmenu = function(e){
                //console.log("CONTEXT EXPRESSION")
                expressionClicked = this.id;
                if(this.className=="can_highlight"){
                    return ;
                }
                if(this.className=="highlight_hedge"){
                    this.className="highlight_booster";
                    item.setAttribute("data-Type", "Booster");
                }
                else{
                    this.className="highlight_hedge";
                    item.setAttribute("data-Type", "Hedge");
                }
                /*if(this.className=="highlight_booster"){
                    this.className="highlight_hedge";
                }
                else{
                    this.className="highlight_booster";
                }*/
                //console.log("Expression's class = "+this.className)
                
            };
            
        }
        if(this.isValid == false){
            item.className = "can_highlight"
        }
        return item ;
    }
    
    getInnerHTML(){
        var expressionHTML = ""
        if(this.isBooster){
            //expressionHTML+='<span onClick=""(function(){this.isValid = false ; //console.log("Done")})" class="can_highlight highlight_booster">'
            expressionHTML+='<span onClick="myclick()" class="can_highlight highlight_booster">'
        }
        else{
            expressionHTML+='<span class="can_highlight highlight_hedge">'
        }
        expressionHTML+=this.expression+'</span> ';
        return expressionHTML;
    }
        
}

function myclick(evt){
    //evt.preventDefault(); 
    //console.log(evt.target.id)    
}


function clickSentence(object){
    //console.dir(object)
    sentenceClicked = this
}

class Sentence {
    constructor(year,title,location,s,index){
        this.sentenceForDisplay = s ;
        this.sentence = s.toLowerCase();
        this.listOfWords = splitIntoSentences(s);
        this.listOfExpressions = new Array();
        this.nbOfHedges = 0;
        this.nbOfBoosters = 0;
        this.nbOfBoosterHedges = 0;
        this.nbOfHedgesBoosters = 0;
        this.nbOfDoubleHedges = 0;
        this.nbOfTrebleHedges = 0;
        this.nbOfQuadrupleHedges = 0;
        this.nbOfDoubleBoosters = 0;
        this.nbOfTrebleBoosters = 0;
        this.nbOfQuadrupleBoosters = 0;
        this.listOfIndexFound = new Array();
        this.sentenceHTML = null ;
        this.sentenceID = "s_"+nbOfSentencesFound;

        this.row = null;
        this.parentElement = null;
        this.totalNumberOfWords = s.split(" ").length;
        this.nbOfWordsBeingHedges = 0;
        this.nbOfWordsBeingBoosters = 0 ;
        this.paperTitle = title;
        this.location = location;
        this.year = year;
        this.shouldBeCoded = true;
        this.index = index ;
        nbOfSentencesFound ++;
    }
    
    reinitiliazeCounters(){
        this.nbOfHedges = 0;
        this.nbOfBoosters = 0;
        this.nbOfBoosterHedges = 0;
        this.nbOfHedgesBoosters = 0;
        this.nbOfDoubleHedges = 0;
        this.nbOfTrebleHedges = 0;
        this.nbOfQuadrupleHedges = 0;
        this.nbOfDoubleBoosters = 0;
        this.nbOfTrebleBoosters = 0;
        this.nbOfQuadrupleBoosters = 0;
        this.nbOfWordsBeingHedges = 0;
        this.nbOfWordsBeingBoosters = 0 ;
        this.listOfIndexFound = new Array();
    }
    
    
    getOnlyKeywords(){
        var e ;
        var listOfKeywords = [];
        for (var i = 0 ; i < this.listOfExpressions.length ; i++){
            e = this.listOfExpressions[i];
            if(e.isSelectedText){
                continue;
            }
            //console.log("Adding")
            var sentenceData = [this.year,this.paperTitle,this.location,'"'+this.sentence+'"',this.index]
            
            listOfKeywords.push(sentenceData.concat(e.getDataForCSV()))
        }
        //console.dir(listOfKeywords)
        return listOfKeywords;
    }
    
    debug1(){
        //console.log("Start debug");
        //console.log("Sentence ="+this.sentence);
        //console.log("Sentence HTML = "+this.sentenceHTML)
        //console.dir(this.listOfExpressions);
        //console.dir(this);
        //console.log("End debug")
    }
    
    updateSentenceAfterRightClick(){
        this.reinitiliazeCounters();
        this.changeExpressionTypeOnRightClick();
        this.makeStatsForSentence();
        this.updateTable(); //Finally, update the table
    }
    
    updateSentenceAfterSelection(){
        this.reinitiliazeCounters();
        this.makeStatsForSentence();
        this.updateTable(); //Finally, update the table
    }
    
    updateSentenceAfterClick(){
        this.reinitiliazeCounters();
        //this.removeExpressionOnClick();
        this.changeExpressionType();
        this.makeStatsForSentence();
        this.updateTable(); //Finally, update the table
    }
    
    updateSentenceAfterFakeDoubleClick(){
        this.reinitiliazeCounters();
        this.changeExpressionTypeDouble();
        this.makeStatsForSentence();
        this.updateTable(); //Finally, update the table
    }
    
    //If it's in the list of expressions
    //return -1 if it's not in the list of expression
    checkIfCharacterIndexIsExpression(index){
        for (var i = 0 ; i < this.listOfExpressions.length ; i++){
            if(index == this.listOfExpressions[i].indexSentenceBegin){
                return i;
            }
        }
        return -1;
    }
    
    handleSelectedText(){
        //console.log("Selection event with "+selectedText)
        //console.log("Handle selected text 1 with selected text = "+selectedText+" and selectionIndex = "+selectionStartIndex)
        if(selectedText!=""){
            //var indexOf = this.sentence.indexOf(selectedText);
            //if the text was already added to the list of hedges/booster, an extra selection removes it
            var alreadyIn = false;
            var alreadyInHylandsList = false ;
            
            //If the selected text was already added, we need to remove it
            for (var i = 0 ; i < this.listOfExpressions.length ; i++){
                //We only give the possibility to remove keywords that were added via selection
                if(this.listOfExpressions[i].isSelectedText){
                    //if(this.listOfExpressions[i].expression.indexOf(selectedText)!=-1){
                    if(this.listOfExpressions[i].expression == selectedText && this.listOfExpressions[i].indexSentenceBegin == selectionStartIndex){
                        //console.log("Selection event size before removal = "+this.listOfExpressions.length)
                        //console.log(" Same index = "+(this.listOfExpressions[i].indexSentenceBegin == selectionStartIndex)+" with this.listOfExpressions[i].indexSentenceBegin = "+this.listOfExpressions[i].indexSentenceBegin+" selectionStartIndex = "+selectionStartIndex)
                        
                        this.listOfExpressions.splice(i,1);
                        //console.log("Selection event size after removal = "+this.listOfExpressions.length)
                        //console.log("Selection event with removal of keyword.")
                        //console.log("Removed because it was already in the list as determined by");
                        //console.log(" Same text = "+(this.listOfExpressions[i].expression == selectedText))
                        alreadyIn = true ;
                    }
                }
            }
            
            // Now we have to check that the selected text does not contain any keyword that was in Hyland's list
            for (var i = 0 ; i < this.listOfExpressions.length ; i++){
                if(this.listOfExpressions[i].isSelectedText){
                    continue;
                }
                var beginInd = this.sentence.indexOf(selectedText);
                var endInd =  beginInd + selectedText.length -1 ;
                
                var beginExpressionInd = this.listOfExpressions[i].indexSentenceBegin;
                var endExpressionInd = this.listOfExpressions[i].indexSentenceEnd;
                
                //There are four cases.
                //1/The selected text is completely within an already selected keyword
                //2/The selected text is a bit before and a bit after
                //3/The selected text is a bit before and stops within a selected keyword
                //4/The selected text is a bit after and starts within a selected keyword
                //console.log("Selection Event TEST beginInd > endExpressionInd = "+(beginInd > endExpressionInd));
                //console.log("Selection Event TEST endInd < beginExpressionInd = "+(endInd < beginExpressionInd));
                if(!((beginInd > endExpressionInd) || (endInd < beginExpressionInd))){
                    //console.log("Selection Event TEST is already A KEYWORD");
                    alreadyInHylandsList = true ;
                }
            }
            
            //console.log("alreadyInHylandsList = "+ alreadyInHylandsList+ "alreadyIn = "+alreadyIn)
            var exp = new Expression(selectedText,"Hedge","NA",selectionStartIndex, true);
            if(alreadyIn == false && alreadyInHylandsList == false){
                this.listOfExpressions.push(exp);
            }

            this.updateSentenceAfterSelection();
            //console.log("Selection EVENT")
            //console.dir(this);
            //console.log("Selection Event row")
            //console.dir(this.parentElement);
            //console.dir(this.row)
            var old_child = this.row ;
            var parent = old_child.parentElement;
            //console.dir(parent);
            old_child.id ="AAAAA"
            this.makeSentenceHTML2();
            this.createRow();
            parent.replaceChild(this.row,old_child);
            selectedText = ""
            //console.log("Handle selected text 3 with selected text = "+selectedText+" and selectionIndex = "+selectionStartIndex)
            //console.dir(this)
        }
    }
    
    changeExpressionTypeDouble(){
        //console.log("Expression clicked="+previousExpressionClicked)
        for( var i = 0 ; i < this.listOfExpressions.length ; i++){
            if(previousExpressionClicked == this.listOfExpressions[i].expressionID ){
                //console.log("Simple click = "+this.listOfExpressions[i].expression)
                if(this.listOfExpressions[i].isValid == false){
                    this.listOfExpressions[i].isBooster = false;
                    this.listOfExpressions[i].isHedge = true;
                    this.listOfExpressions[i].isValid = true ;
                    //console.log("Was invalid, now Hedge")
                    //console.dir(this)
                }
                else if(this.listOfExpressions[i].isHedge){
                    this.listOfExpressions[i].isValid = true ;
                    this.listOfExpressions[i].isHedge = false;
                    this.listOfExpressions[i].isBooster = true;
                    //console.log("Was hedge, now booster")
                }
                else if(this.listOfExpressions[i].isBooster){
                    this.listOfExpressions[i].isHedge = false;
                    this.listOfExpressions[i].isBooster = false;
                    this.listOfExpressions[i].isValid = false ;
                    //console.log("Was Booster, now invalid")
                }
                //this.listOfExpressions[i].isBooster = !this.listOfExpressions[i].isBooster;
                //this.listOfExpressions[i].isHedge = !this.listOfExpressions[i].isHedge;
                //console.log("Expression's class changed and isBooster = "+this.listOfExpressions[i].isBooster+ " while isHedge = "+this.listOfExpressions[i].isHedge);
            }
        }
    }
    
    
    changeExpressionType(){
        //console.log("Expression clicked="+expressionClicked)
        for( var i = 0 ; i < this.listOfExpressions.length ; i++){
            if(expressionClicked == this.listOfExpressions[i].expressionID ){
                //console.log("expressionClicked = "+this.listOfExpressions[i].expression)
                if(this.listOfExpressions[i].isValid == false){
                    this.listOfExpressions[i].isBooster = false;
                    this.listOfExpressions[i].isHedge = true;
                    this.listOfExpressions[i].isValid = true ;
                    //console.log("Was invalid, now Hedge")
                    //console.dir(this)
                }
                else if(this.listOfExpressions[i].isHedge){
                    this.listOfExpressions[i].isValid = true ;
                    this.listOfExpressions[i].isHedge = false;
                    this.listOfExpressions[i].isBooster = true;
                    //console.log("Was hedge, now booster")
                }
                else if(this.listOfExpressions[i].isBooster){
                    this.listOfExpressions[i].isHedge = false;
                    this.listOfExpressions[i].isBooster = false;
                    this.listOfExpressions[i].isValid = false ;
                    //console.log("Was Booster, now invalid")
                }
                //this.listOfExpressions[i].isBooster = !this.listOfExpressions[i].isBooster;
                //this.listOfExpressions[i].isHedge = !this.listOfExpressions[i].isHedge;
                //console.log("Expression's class changed and isBooster = "+this.listOfExpressions[i].isBooster+ " while isHedge = "+this.listOfExpressions[i].isHedge);
            }
        }
    }
    
    changeExpressionTypeOnRightClick(){
        for( var i = 0 ; i < this.listOfExpressions.length ; i++){
            if(expressionClicked == this.listOfExpressions[i].expressionID && this.listOfExpressions[i].isValid){
                this.listOfExpressions[i].isBooster = !this.listOfExpressions[i].isBooster;
                this.listOfExpressions[i].isHedge = !this.listOfExpressions[i].isHedge;
                //console.log("Expression's class changed and isBooster = "+this.listOfExpressions[i].isBooster+ " while isHedge = "+this.listOfExpressions[i].isHedge);
            }
        }
    }
    
    removeExpressionOnClick(){
        for( var i = 0 ; i < this.listOfExpressions.length ; i++){
            if(expressionClicked == this.listOfExpressions[i].expressionID){
                this.listOfExpressions[i].isValid = !this.listOfExpressions[i].isValid;
            }
        }
        //console.log("Expression "+expressionClicked+ "removed");
        
    }
    
    updateTable(){
        var list = [];
        list.push(this.nbOfHedges)
        list.push(this.nbOfBoosters)
        list.push(this.nbOfDoubleHedges)
        list.push(this.nbOfTrebleHedges)
        list.push(this.nbOfQuadrupleHedges)
        list.push(this.nbOfDoubleBoosters)
        list.push(this.nbOfTrebleBoosters)
        list.push(this.nbOfQuadrupleBoosters)
        list.push(this.nbOfHedgesBoosters)
        list.push(this.nbOfBoosterHedges)
        
        
        var children = this.row.children;
        //Start at 1 because the sentence is not going to change
        for (var i = 1; i < children.length; i++) {
            children[i].innerHTML = list[i-1];
        }
    }
    
    static getSelectionCharacterOffsetsWithin(element) {  
        var startOffset, endOffset ;
        var sel = window.getSelection()
        selectedText = sel.toString().toLowerCase();
        //console.dir(selectedText)
        //console.log("eeeee")        
        if(selectedText != ""){
            
            //console.log("Handle selected text 2 with selected text = "+selectedText+" and selectionIndex = "+selectionStartIndex)
            if (typeof window.getSelection != "undefined") {
                var range = window.getSelection().getRangeAt(0);
                var preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(element);
                preCaretRange.setEnd(range.startContainer, range.startOffset);
                startOffset = preCaretRange.toString().length;
                endOffset = startOffset + range.toString().length;
            } else if (typeof document.selection != "undefined" &&document.selection.type != "Control") {
                var textRange = document.selection.createRange();
                var preCaretTextRange = document.body.createTextRange();
                preCaretTextRange.moveToElementText(element);
                preCaretTextRange.setEndPoint("EndToStart", textRange);
                startOffset = preCaretTextRange.text.length;
                endOffset = startOffset + textRange.text.length;
            }
            //console.log("selection start at "+selectionStartIndex)
        }
        selectionStartIndex = startOffset ;
    }
    
    makeSentenceHTML2(){
        //console.log(this.sentence)
        var sentenceHTML = document.createElement("td")
        sentenceHTML.id = this.sentenceID;
        sentenceHTML.onclick = function () {
            sentenceClicked = this.id;
            //console.log("Simple click sentence")
            //console.log("ID OF SENTENCE = "+sentenceClicked)
        }
        sentenceHTML.ondblclick = function(e){
            //e.preventDefault();
            clearSelection();
            //console.log("Simple click == Double click")
        }
        /*sentenceHTML.oncontextmenu = function(e){
            sentenceClicked = this.id;
            //e.preventDefault();
            //console.log("CONTEXT SENTENCE = "+sentenceClicked)
        }*/
        sentenceHTML.onmouseup = function(e){
            sentenceClicked = this.id;
            //console.log("On Mouse Up")
            var selOffsets = Sentence.getSelectionCharacterOffsetsWithin(this);
            //console.log(selOffsets)
            //alert("Start: " + selOffsets.start + ", end: " + selOffsets.end);
            if(e.detail == 2){
                //console.log("Simple click calling ‡body")
                fakeDoubleClick();
            }
        }
        var item ;
        for (var i = 0 ; i < this.sentence.length ; i++){
            var indexOfExpression = this.checkIfCharacterIndexIsExpression(i);
            if(indexOfExpression!=-1){
                item = this.listOfExpressions[indexOfExpression].getHTMLElement();
                sentenceHTML.appendChild(item)
                //console.dir(item)
                //console.log("ITEM INNER HTML = "+item.outerHTML)
                i = this.listOfExpressions[indexOfExpression].indexSentenceEnd;
            }
            else{
                item = document.createTextNode(this.sentenceForDisplay.charAt(i));
                sentenceHTML.appendChild(item);
            }
        }
        //console.dir(sentenceHTML)
        item = document.createElement("br");
        sentenceHTML.appendChild(item);
        //stringHTML+="</td>"
        //sentenceHTML.innerHTML = stringHTML
        
        this.sentenceHTML = sentenceHTML ;
        this.createRow();
    }

    
    identifyFollowers(){
        var id = -1 ;
        var previousExpressionHadFollower = false ;
        //console.log("*******************************")
        //console.dir(this)
        //console.log("*******************************")
        for(var i = 0 ; i < this.listOfExpressions.length ; i++){
            if(previousExpressionHadFollower){
                id += 1 ;
            }
            else{
                id+=2 ;
            }
            previousExpressionHadFollower = false ;
            this.listOfExpressions[i].id = id ;
            //console.log("listOfExpressions[i].expression = "+this.listOfExpressions[i].expression+ " listOfExpressions[i].id = "+this.listOfExpressions[i].id)
            //console.log("Word = "+this.listOfExpressions[i].expression)
            var indexEnd = this.listOfExpressions[i].indexSentenceEnd+1;    //We want to have the character right after the current word
            var indexNextWord = this.getIndexOfNextWord(indexEnd);
            if(indexNextWord != -1){
                if(i < this.listOfExpressions.length-1){
                    var indexNextKeyword = this.listOfExpressions[i+1].indexSentenceBegin;
                    //console.log("indexNextWord = "+indexNextWord);
                    //console.log("indexNextKeyword = "+indexNextKeyword);
                    if( indexNextKeyword == indexNextWord){
                        this.listOfExpressions[i].hasFollower = true ;
                        previousExpressionHadFollower = true ;
                    }
                }
                
            }
            
        }
    }
    
    isPunctuation(character){
        var punctuations = '`~!@#$%^&*()_+{}|:"<>?-=[]\;\'.\/,';
        if (punctuations.indexOf(character) != -1) return true;
        return false;
    }
    
    isLetter(character){
        return character.toUpperCase() != character.toLowerCase();
    }
    
    
    sortListOfExpression(){
        this.listOfExpressions.sort((a, b) => (a.indexSentenceBegin > b.indexSentenceBegin) ? 1 : -1);
    }
    
    getIndexOfNextWord(endingIndex){
        var i = endingIndex
        var character ; 
        while(i < this.sentence.length){
            character = this.sentence.charAt(i);
            if(this.isPunctuation(character)){
                return -1;
            }
            if(this.isLetter(character)){
                return i;
            }
            i++;
        }
        
        return -1;
        
    }
    
    
    
    // Returns the position in the list if the index is found as the starting of a word that is in listOfExpression
    // Return -1 if not
    isIndexInListOfExpression(index){
        for(var i = 0 ; i < this.listOfExpressions.length ; i++){
            if(this.listOfExpressions[i].indexSentenceBegin == index){
                return i ;
            }
        }
        return -1 ;
    }
    
    makeStatsForSentence(){
        if(this.shouldBeCoded == false){
            return ;
        }
        var checkedFollowersUntil =0;
        for (var i = 0 ; i < this.listOfExpressions.length ; i++){
            var expression = this.listOfExpressions[i];
            if(expression.isValid == false){
                continue;
            }
            var countFollowers = 0;
            var j = i ;
            var followerOfDifferentType = false ;
            //console.log("J = "+j+" checkedFollowersUntil = "+checkedFollowersUntil+"J >= -->"+this.listOfExpressions[checkedFollowersUntil].expression)
            if(j>=checkedFollowersUntil == true){
                //console.log("2nd J >= -->"+(j>=checkedFollowersUntil))
                //console.log("J = "+j+" word = "+this.listOfExpressions[j].expression+" has follower = "+this.listOfExpressions[j].hasFollower)
                while(j < this.listOfExpressions.length && this.listOfExpressions[j].hasFollower == true && this.listOfExpressions[j+1].isValid ){
                    countFollowers += 1
                    if(this.listOfExpressions[j].isHedge != this.listOfExpressions[j+1].isHedge){
                        followerOfDifferentType = true ;
                    }
                    //console.log("J = "+1+" word = "+this.listOfExpressions[j].expression+" has follower = "+this.listOfExpressions[j].hasFollower+" which is of different type = "+followerOfDifferentType)
                    j++;
                    checkedFollowersUntil = j
                }

                var lastFollower = j
                while(lastFollower != i){
                    //console.log("lastFo")
                    //console.log("Iteration = "+lastFollower)
                    //First the case that the search finished because the next following keyword was of different type
                    //The new value of J is now the follower of a different type
                    //These two keywords are probably a couple
                    if(followerOfDifferentType){
                        //console.log("IF")
                        //If keyword J is a hedge, j-1 is a booster
                        if(this.listOfExpressions[lastFollower].isHedge){
                            //console.log(""+this.listOfExpressions[lastFollower-1].expression+" AND "+this.listOfExpressions[lastFollower].expression+" are boosterHedges")
                            this.nbOfBoosterHedges ++;
                        }
                        else{
                            //console.log(""+this.listOfExpressions[lastFollower-1].expression+" AND "+this.listOfExpressions[lastFollower].expression+" are hedgesBoosters")
                            this.nbOfHedgesBoosters ++;
                        }
                        checkedFollowersUntil = lastFollower;
                        countFollowers -=2; //Change to -=1 if we want to count two hedges + booster as a double hedge and a hedge booster.
                    }

                    //Now the case that the next keyword simply does not have a follower
                    else{
                        //console.log("ELSE")
                        if(countFollowers == 1){
                            //console.log("Double Keyword with word = "+expression.expression)
                            if(expression.isHedge){
                                this.nbOfDoubleHedges ++;
                            }
                            else{
                                this.nbOfDoubleBoosters ++;
                            }
                            countFollowers -=1;
                        }
                        else if(countFollowers == 2){
                            //console.log("Treble Keyword with word = "+expression.expression)
                            if(expression.isHedge){
                                this.nbOfTrebleHedges ++;
                            }
                            else{
                                this.nbOfTrebleBoosters ++;
                            }
                            countFollowers -=2;
                        }
                        else if(countFollowers == 3){
                            if(expression.isHedge){
                                this.nbOfQuadrupleHedges ++;
                            }
                            else{
                                this.nbOfQuadrupleBoosters ++;
                            }
                            countFollowers -=3;
                        }
                        else{
                            logData += "Sentence: "+this.sentence+" has a sequence with more than 4 followers. Please check\n"
                        }
                    }
                    followerOfDifferentType = false;
                    lastFollower --;
                }
            }
            //console.log("checkedFollowersUntil = "+checkedFollowersUntil)
            //console.log("checkedFollowersUntil word = "+this.listOfExpressions[checkedFollowersUntil].expression)
            
            
            if(expression.isHedge){
                if(expression.isSelectedText == false){
                    var nbOfWordsInExpression = expression.expression.split(" ").length;
                    this.nbOfWordsBeingHedges += nbOfWordsInExpression ;
                    this.nbOfHedges ++;
                }
               
            }
            else{
                if(expression.isSelectedText == false){
                    this.nbOfBoosters ++;
                    var nbOfWordsInExpression = expression.expression.split(" ").length;
                    this.nbOfWordsBeingBoosters += nbOfWordsInExpression ;
                }
                //console.log("NB OF WORDS BEING BOOSTERS = "+this.nbOfWordsBeingBoosters)
            }
            
        }
    }
    
    //Remove possible duplicates, e.g., "would", and "would not" --> "Would not" should be kept but "would" removed
    cleanListOfExpressions(){
        var expressionI ;
        var expressionJ ;
        var isLocatedAtSimilarPlace ;
        //console.dir(this.listOfExpressions)
        for(var i = 0 ; i < this.listOfExpressions.length ; i++){
            for(var j = 0; j < this.listOfExpressions.length ; j++){
                isLocatedAtSimilarPlace = false ;
                expressionI = this.listOfExpressions[i];
                expressionJ = this.listOfExpressions[j];
                /*//console.log("Expression[i] = "+expressionI.expression)
                //console.log("Expression[j] = "+expressionJ.expression)
                //console.log("Is Found = "+expressionJ.expression.indexOf(expressionI.expression));
                //console.log("this.listOfExpressions[i].indexSentenceBegin = "+expressionI.indexSentenceBegin);
                //console.log("this.listOfExpressions[j].indexSentenceBegin = "+this.listOfExpressions[j].indexSentenceBegin);*/
                
                // The easy case, they start at the same location in the sentence, they are about the same expression in the sentence
                // This finds cases of "believe" and "believed" or "believing", or even "would" and "would not".
                if(expressionJ.indexSentenceBegin == expressionI.indexSentenceBegin){
                    //console.log("Starts at the same index")
                    isLocatedAtSimilarPlace = true ;
                }
                // There is also the case of "to assume" and "assume" for which the index in the sentence is going to be different.
                // We check for the ending index in the sentence then.
                if(expressionJ.indexSentenceEnd == expressionI.indexSentenceEnd){
                    //console.log("Ends at the same index")
                    isLocatedAtSimilarPlace = true ;
                }
                
                if(i!=j && expressionJ.expression.indexOf(expressionI.expression)!=-1 && isLocatedAtSimilarPlace){
                    //console.log("Removing "+expressionI.expression+" because "+expressionJ.expression +" was there");
                    //console.log("Removing index i = "+i+" because j = "+j +" was there");
                    this.listOfExpressions.splice(i,1);
                    if(i > 0)
                    i--;
                    if(j >= i && j > 0){
                        j--;
                    }  
                  
                }
            }
        }
        //console.dir(this.listOfExpressions)
    }
    
    getIndicesOf(searchStr) {
        var searchStrLen = searchStr.length;
        if (searchStrLen == 0) {
            return [];
        }
        var startIndex = 0, index, indices = [];
        
        while ((index = this.sentence.indexOf(searchStr, startIndex)) > -1) {
            //If we found the word, we need to make sure that it's not part of another word. For instance "prove" would appear in "improve"
            //For that we simply check whether or not the next character and the preceeding character are not letters
            var preceedingChar = this.sentence.charAt(index-1);
            var nextChar = this.sentence.charAt(index+searchStrLen)
            if(preceedingChar.toLowerCase() == preceedingChar.toUpperCase() && nextChar.toLowerCase() == nextChar.toUpperCase()){
                //console.log("preceedingChar = "+preceedingChar+ " and nextChar = "+nextChar)
                indices.push(index);
            }
            startIndex = index + searchStrLen;
        }
        return indices;
    }
    
    
    checkSentence(){
        var keyword ;
        for (var i = 0 ; i < listOfKeywords.length ; i++){
            keyword = listOfKeywords[i];
            //console.log("loop for at "+keyword[0])
            var indices = this.getIndicesOf(keyword[0]);
            if(indices!=[]){
                for(var j=0; j < indices.length ; j++){
                    var index = indices[j];
                    var indexEnd = index + keyword.length;
                    //console.log("FOUND "+keyword)
                    //if(this.sentence.charAt(indexEnd).toLowerCase()==this.sentence.charAt(indexEnd).toUpperCase()){ //Remove this test if something goes wrong, it should remove cases of "do" being in "doubt"
                        this.listOfIndexFound.push(index);
                        var e = new Expression(keyword[0],keyword[1],keyword[2],index);
                        this.listOfExpressions.push(e);
                    //}
                }
            }
            /*if( indexOf !== -1){
                //console.log("Expression = "+keyword[0]+" found with");
                this.listOfIndexFound.push(i);
                var e = new Expression(keyword[0],keyword[1],keyword[2],indexOf);
                this.listOfExpressions.push(e);
            }*/
        }
        //console.dir(this)
        this.sortListOfExpression();
        this.cleanListOfExpressions();
        this.identifyFollowers();
        this.makeStatsForSentence();
        this.makeSentenceHTML2();
    }
    
    static createRowHeader(){
        var sentence = document.createElement("td");
        sentence.innerHTML = "Sentence"
        sentence.className = "sentence"
        
        var currentRow = document.createElement("tr");
        currentRow.appendChild(sentence);
        var nbOfHedges = document.createElement("td");
        nbOfHedges.innerHTML = "nbHedges";
        nbOfHedges.className = "nbHedges";
        var nbOfBoosters = document.createElement("td");
        nbOfBoosters.innerHTML = "nbBoosters" ;
        nbOfBoosters.className = "nbOfBoosters";
        var nbOfDoubleHedges = document.createElement("td");
        nbOfDoubleHedges.innerHTML = "nbDoubleH";
        nbOfDoubleHedges.className = "nbOfDoubleHedges";
        var nbOfTrebleHedges = document.createElement("td");
        nbOfTrebleHedges.innerHTML = "nbTrebleH";
        nbOfTrebleHedges.className = "nbOfTripleHedges";
        var nbOfQuadrubleHedges = document.createElement("td");
        nbOfQuadrubleHedges.innerHTML = "nbQuadH" ;
        nbOfQuadrubleHedges.className = "nbOfQuadrubleHedges";
        var nbOfDoubleBoosters = document.createElement("td");
        nbOfDoubleBoosters.className = "nbOfDoubleBoosters";
        nbOfDoubleBoosters.innerHTML = "nbDoubleB";
        var nbOfTrebleBoosters = document.createElement("td");
        nbOfTrebleBoosters.className = "nbOfTrebleBoosters";
        nbOfTrebleBoosters.innerHTML = "nbTrebleB" ;
        var nbOfQuadrupleBoosters = document.createElement("td");
        nbOfQuadrupleBoosters.className = "nbOfQuadrupleBoosters";
        nbOfQuadrupleBoosters.innerHTML = "nbQuadB" ;
        var nbOfHedgesBoosters = document.createElement("td");
        nbOfHedgesBoosters.className = "nbOfHedgesBoosters";
        nbOfHedgesBoosters.innerHTML = "nbHB" ;
        var nbOfBoosterHedges = document.createElement("td");
        nbOfBoosterHedges.innerHTML = "nbBH";
        nbOfBoosterHedges.className = "nbOfBoosterHedges";

        currentRow.appendChild(nbOfHedges);
        currentRow.appendChild(nbOfBoosters);
        currentRow.appendChild(nbOfDoubleHedges);
        currentRow.appendChild(nbOfTrebleHedges);
        currentRow.appendChild(nbOfQuadrubleHedges);
        currentRow.appendChild(nbOfDoubleBoosters);
        currentRow.appendChild(nbOfTrebleBoosters);
        currentRow.appendChild(nbOfQuadrupleBoosters);
        currentRow.appendChild(nbOfHedgesBoosters);
        currentRow.appendChild(nbOfBoosterHedges);
       
        //currentRow.onclick = createClickHandler(currentRow);
        //currentRow.appendChild(isAboutUncertainty);
        
        
        //console.log("CREATE ROWWWWWWWW");
        //console.dir(currentRow)
        return currentRow ;
    }
    
    createRow(){
        //console.log("createRow")
        var sentence = document.createElement("td");
        sentence = this.sentenceHTML
        sentence.className = "sentence"
        
        var currentRow = document.createElement("tr");
        currentRow.appendChild(sentence);

        if(debugMode){
            var nbOfHedges = document.createElement("td");
            nbOfHedges.innerHTML = this.nbOfHedges;
            nbOfHedges.className = "nbHedges";
            var nbOfBoosters = document.createElement("td");
            nbOfBoosters.innerHTML = this.nbOfBoosters ;
            nbOfBoosters.className = "nbOfBoosters";
            var nbOfDoubleHedges = document.createElement("td");
            nbOfDoubleHedges.innerHTML = this.nbOfDoubleHedges;
            nbOfDoubleHedges.className = "nbOfDoubleHedges";
            var nbOfTrebleHedges = document.createElement("td");
            nbOfTrebleHedges.innerHTML = this.nbOfTrebleHedges;
            nbOfTrebleHedges.className = "nbOfTripleHedges";
            var nbOfQuadrubleHedges = document.createElement("td");
            nbOfQuadrubleHedges.innerHTML = this.nbOfQuadrupleHedges ;
            nbOfQuadrubleHedges.className = "nbOfQuadrubleHedges";
            var nbOfDoubleBoosters = document.createElement("td");
            nbOfDoubleBoosters.className = "nbOfDoubleBoosters";
            nbOfDoubleBoosters.innerHTML = this.nbOfDoubleBoosters;
            var nbOfTrebleBoosters = document.createElement("td");
            nbOfTrebleBoosters.className = "nbOfTrebleBoosters";
            nbOfTrebleBoosters.innerHTML = this.nbOfTrebleBoosters ;
            var nbOfQuadrupleBoosters = document.createElement("td");
            nbOfQuadrupleBoosters.className = "nbOfQuadrupleBoosters";
            nbOfQuadrupleBoosters.innerHTML = this.nbOfQuadrupleBoosters ;
            var nbOfHedgesBoosters = document.createElement("td");
            nbOfHedgesBoosters.className = "nbOfHedgesBoosters";
            nbOfHedgesBoosters.innerHTML = this.nbOfHedgesBoosters ;
            var nbOfBoosterHedges = document.createElement("td");
            nbOfBoosterHedges.className = "nbOfBoosterHedges";
            nbOfBoosterHedges.innerHTML = this.nbOfBoosterHedges;
            
            currentRow.appendChild(nbOfHedges);
            currentRow.appendChild(nbOfBoosters);
            currentRow.appendChild(nbOfDoubleHedges);
            currentRow.appendChild(nbOfTrebleHedges);
            currentRow.appendChild(nbOfQuadrubleHedges);
            currentRow.appendChild(nbOfDoubleBoosters);
            currentRow.appendChild(nbOfTrebleBoosters);
            currentRow.appendChild(nbOfQuadrupleBoosters);
            currentRow.appendChild(nbOfHedgesBoosters);
            currentRow.appendChild(nbOfBoosterHedges);
        }
        
        // if it's not the first time you're creating row - first put the prev row into the table, then reassign it to a new table row.
        /*if (typeof currentRow !== 'undefined') {
            //console.log("UNDEFINED")
            table.appendChild(currentRow);
        }*/

        
        //currentRow.onclick = createClickHandler(currentRow);
        //currentRow.appendChild(isAboutUncertainty);
        
        
        //console.log("currentRow")
        //console.dir(currentRow)
        this.row = currentRow ;
        //console.dir(this.row)
        /*addSentenceToData(sentences[i],paper_name,paper_year,paper_study,section_type)
        countSentences++;*/

    }
    
}




//this function add the new elem to the list if it's not there already
//or simply add one to the counter of occurences
function checkAdditionalWord(list,elem){
    var type ;
    if(elem.isBooster){
        type = "Booster"
    }
    else{
        type = "Hedge"
    }
    for(var i = 0 ; i < list.length ; i++){
        if (list[i][0] == elem.expression && list[i][2] == type){
            list[i][1] += 1;
            //console.log("TESTTEST")
            return true
        }
    }
    list.push([elem.expression,1,type]);
    //console.log("TESTTEST2")
    
}

function getAdditionalWords(){
    var e ;
    var listOfAdditionalWords = [];
    listOfAdditionalWords.push(["expression","occurence","type"])
    for (var j = 0 ; j < listOfSentences.length ; j++){
        s = listOfSentences[j]
        for (var i = 0 ; i < s.listOfExpressions.length ; i++){
            e = s.listOfExpressions[i];
            //console.dir(e)
            if(!e.isSelectedText){
                //console.log("TESTTEST3")
                continue;
            }
            //console.log("TESTTEST4")
            checkAdditionalWord(listOfAdditionalWords,e)
        }
    }
    return listOfAdditionalWords;
}

function getSentenceExtraData2(){
    data = [["Year","Type","Location","shouldBeCoded","nbOfHedges","nbOfBoosters","nbOfDoubleHedge","nbOfTrebleHedges","nbOfQuadrupleHedges","nbOfDoubleBoosters","nbOfTrebleBoosters","nbOfQuadrupleBoosters","nbOfHedgesBoosters","nbOfBoosterHedges","nbOfWordsBeingHedges","nbOfWordsBeingBoosters","totalNbOfWords"]]
    for (var i = 0 ; i < listOfSentences.length ; i++){
       s = listOfSentences[i];
        data.push([s.year,s.paperType,s.location,s.shouldBeCoded,s.nbOfHedges,s.nbOfBoosters,s.nbOfDoubleHedges,s.nbOfTrebleHedges,s.nbOfQuadrupleHedges,s.nbOfDoubleBoosters,s.nbOfTrebleBoosters,s.nbOfQuadrupleBoosters,s.nbOfHedgesBoosters,s.nbOfBoosterHedges,s.nbOfWordsBeingHedges,s.nbOfWordsBeingBoosters,s.totalNumberOfWords])   
    }
    
    return data ;
}

function getSentenceExtraData(){
    data = [["Year","Type","Location","shouldBeCoded","nbOfHedges","nbOfBoosters","nbOfDoubleHedge","nbOfTrebleHedges","nbOfQuadrupleHedges","nbOfDoubleBoosters","nbOfTrebleBoosters","nbOfQuadrupleBoosters","nbOfHedgesBoosters","nbOfBoosterHedges","nbOfWordsBeingHedges","nbOfWordsBeingBoosters","totalNbOfWords"]]
    for (var i = 0 ; i < listYears.length ; i++){
        for (var j = 0 ; j < listTypes.length ; j++){
            for (var k = 0 ; k < listLocations.length ; k++){
                data.push(getSentenceExtraDataPerYearTypeAndLocation(listLocations[k],listTypes[j],listYears[i]));
            }
        }
    }
    //console.log("SENTENCE EXTRA DATA")
    //console.dir(data)
    return data ;
}

function getSentenceExtraDataPerYearTypeAndLocation(location,type,year){
    var totalNbOfWords = 0;
    var nbOfHedges = 0;
    var nbOfBoosters = 0;
    var nbOfBoosterHedges = 0;
    var nbOfHedgesBoosters = 0;
    var nbOfDoubleHedges = 0;
    var nbOfTrebleHedges = 0;
    var nbOfQuadrupleHedges = 0;
    var nbOfDoubleBoosters = 0;
    var nbOfTrebleBoosters = 0;
    var nbOfQuadrupleBoosters = 0;
    var nbOfWordsBeingHedges = 0;
    var nbOfWordsBeingBoosters = 0 ;
    for (var j = 0 ; j < listOfSentences.length ; j++){
        var s = listOfSentences[j]
        if(s.location == location && s.year == year && type == s.paperType){
            nbOfHedges += s.nbOfHedges;
            nbOfBoosters += s.nbOfBoosters;
            nbOfBoosterHedges += s.nbOfBoosterHedges;
            nbOfHedgesBoosters += s.nbOfHedgesBoosters ;
            nbOfDoubleHedges += s.nbOfDoubleHedges;
            nbOfTrebleHedges += s.nbOfTrebleHedges ;
            nbOfQuadrupleHedges += s.nbOfQuadrupleHedges ;
            nbOfDoubleBoosters += s.nbOfDoubleBoosters;
            nbOfTrebleBoosters += s.nbOfTrebleBoosters ;
            nbOfQuadrupleBoosters += s.nbOfQuadrupleBoosters;
            totalNbOfWords += s.totalNumberOfWords ;
            nbOfWordsBeingHedges += s.nbOfWordsBeingHedges;
            nbOfWordsBeingBoosters += s.nbOfWordsBeingBoosters ;
        }
        else{
        }
    }
    //console.dir(data)
    return [year,type,location,nbOfHedges,nbOfBoosters,nbOfDoubleHedges,nbOfTrebleHedges,nbOfQuadrupleHedges,nbOfDoubleBoosters,nbOfTrebleBoosters,nbOfQuadrupleBoosters,nbOfHedgesBoosters,nbOfBoosterHedges,nbOfWordsBeingHedges,nbOfWordsBeingBoosters,totalNbOfWords]
}


function getAllKeywords(){
    var data = [];
    data.push(["Year","Paper","Location","Sentence","SentenceIndex","Term","TermIndex","isValid","GrammarType","OriginalCategorization","FinalCategorization"])
    for (var j = 0 ; j < listOfSentences.length ; j++){
        var listFromSentence = listOfSentences[j].getOnlyKeywords();
        for(var i = 0 ; i < listFromSentence.length ; i++){
            data.push(listFromSentence[i]);
        }
    }
    //console.dir(data)
    return data ;
}




function createTable(){
    currentRow = document.createElement("tr");
    item = document.createElement("td");
    item.className = "header"
    item.innerHTML = "Sentences";
    currentRow.appendChild(item);
    item = document.createElement("td");
    item.innerHTML = "Contains a result report?";
    item.className = "header"
    currentRow.appendChild(item);
    table.appendChild(currentRow);

    for (var i = 0; i < sentences.length; i++) {
        //console.log("I = "+i+ " sentences["+i+"] = "+sentences[i])
        // put items in.
        
    // put the table into the mainPart element
    document.getElementById('mainPart').appendChild(h3Tag);
    document.getElementById('mainPart').appendChild(table);
    }
}


function computeDataAndUI(){
    var currentYear = 1;
    //var currentLocation = 1;
    var currentPaper = 1;
    var s = null;
    var h3 ;
    var table = document.createElement("table");
    var rowHeader ;
    //console.log("TAAAAAAABBBBBBLLLLLLLLEEEEEE")
    for (var i = 0 ; i < listOfSentences.length ; i++){
        s = listOfSentences[i];
        s.checkSentence();
        //console.log("Checked sentences")
        if(s.year!=currentYear || s.paperTitle != currentPaper){
            if(table){
                //console.log("ADDING TABLE");
                document.getElementById("Tables").appendChild(table);
            }
            currentYear = s.year ;
            currentPaper = s.paperTitle ;
            h3 = document.createElement("h3");
            h3.textContent=s.year+" - "+s.paperTitle;
            document.getElementById("Tables").appendChild(h3);
            table = document.createElement("table");
            if(debugMode){
                rowHeader = Sentence.createRowHeader();
                table.appendChild(rowHeader);
            }
            
        }
        table.appendChild(s.row);
        s.parentElement = table;
    }
    
    document.getElementById("Tables").appendChild(table);
}


function initiate(){
    // fileInput = document.getElementById("csv");
    // fileInput.addEventListener('change', readFile);
    // listInput = document.getElementById("listBtn");
    // listInput.addEventListener('change', readList);
    data = new Array();
    finalData = new Array();
    finalData.push(["nbOfHedges","nbOfBoosters","nbOfBoosterHedges","nbOfHedgesBoosters","nbOfDoubleHedges","nbOfTrebleHedges","nbOfQuadrupleHedges","nbOfDoubleBoosters","nbOfTrebleBoosters","nbOfQuadrupleBoosters"]);
    hedgesboosters = new Array();
    data.push(["Year","Paper_title","Study_type","Location","Sentence","Dummy"])
    countSentences = 1;
    readFile();
    readList();
}






function saveCSV(beginOfName=""){
    var csv = '';
    var data = getAllKeywords();
    var downloadName = beginOfName+"Expressions - "+coderName+".csv"
    data.forEach(function(row) {
            line = row[0]+","
            csv += row.join(',');
            csv += "\n";
    });
    
    //console.log(csv);
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = downloadName;
    hiddenElement.click();
    
    
    
    /*data = getSentenceExtraData2();
    downloadName = beginOfName+"AddData - "+coderName+".csv"
    csv = '';
    //console.dir(data)
    data.forEach(function(row) {
            line = row[0]+","
            csv += row.join(',');
            csv += "\n";
    });
    hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'dataPerSentence.csv';
    hiddenElement.click();*/
    
    csv = '';
    data = getAdditionalWords();
    //console.dir(data)
    downloadName = beginOfName+"AdditionalWords - "+coderName+".csv"
    data.forEach(function(row) {
            line = row[0]+","
            csv += row.join(',');
            csv += "\n";
    });
    hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = downloadName;
    hiddenElement.click();
    
    //console.log("Data exported to CSV")
}

function highlightText(index,type){
    if (index >= 0) { 
        innerHTML = innerHTML.substring(0,index) + "<span class='highlight'>" + innerHTML.substring(index,index+text.length) + "</span>" + innerHTML.substring(index + text.length);
        inputText.innerHTML = innerHTML;
    }
}

// We only display the sentences that have a match
function updateData (listOfKeywordFound,nbOfHedges,nbOfBoosters,nbOfBoosterHedges,nbOfHedgesBoosters,nbOfDoubleHedges,nbOfTrebleHedges,nbOfQuadrupleHedges,nbOfDoubleBoosters,nbOfTrebleBoosters,nbOfQuadrupleBoosters){
    //console.log("updateUI");
    //data.push(keyword,isHedge,isBooster,isAdjective,isAdverb,isModal,isVerb,isNoun,isHedgeBooster,isBoosterHedge,isDoubleHedge,isTripleHedge,isQuadrupleHedge);
    for(var i = 0 ; i < listOfKeywordFound.length ; i++){
        
    }
    finalData.push([nbOfHedges,nbOfBoosters,nbOfBoosterHedges,nbOfHedgesBoosters,nbOfDoubleHedges,nbOfTrebleHedges,nbOfQuadrupleHedges,nbOfDoubleBoosters,nbOfTrebleBoosters,nbOfQuadrupleBoosters]);
    //console.dir(finalData)
}

function checkSentence(sentence){
    var listOfKeywordFound ;
    var nbOfConsecutiveHedges = 0;
    var nbOfConsecutiveBoosters = 0;
    var keywordFound = false ;
    var nbOfHedges = 0;
    var nbOfBoosters = 0;
    var nbOfBoosterHedges = 0;
    var nbOfHedgesBoosters = 0;
    var nbOfDoubleHedges = 0;
    var nbOfTrebleHedges = 0;
    var nbOfQuadrupleHedges = 0;
    var nbOfDoubleBoosters = 0;
    var nbOfTrebleBoosters = 0;
    var nbOfQuadrupleBoosters = 0;
    var isHedgeOrBooster = -1 ; //0 for hedge, 1 for boosters
    listOfKeywordFound = new Array();
    sentence = sentence.toLowerCase()
    words = sentence.replace(/[^\w\s]|_/g, function ($1) { return ' ' + $1 + ' ';}).replace(/[ ]+/g, ' ').split(' ');
    //console.dir(words)
    for(var k = 0 ; k < words.length ; k++){
        for(var j = 0 ; j < hedgesboosters.length ; j++){
            //console.log("Word = "+words[k]+" list = "+hedgesboosters[j][0])
            if (words[k] == hedgesboosters[j][0]){
                keywordFound = true ;
                listOfKeywordFound.push(j); //This is for highlighting text
                hedgesboosters[j][1] == "Booster"? isHedgeOrBooster = 1: isHedgeOrBooster = 0;
                if(isHedgeOrBooster == 1){
                    //console.log("found Booster with "+words[k])
                    nbOfBoosters++; 
                }
                else if(isHedgeOrBooster == 0){
                    //console.log("found Hedges with "+words[k])
                    nbOfHedges++; 
                }
                else{
                    //console.log("ERROR")
                }
            break ; //We have identified the word, no need to go futher in the list of hedges
            }
        }

        if(keywordFound == false){
            // The current word was not a hedge or booster, we can check for double/treble/quadruble hedges/booster
            if(isHedgeOrBooster == 1){   //If the word we found was a booster
                switch(nbOfConsecutiveBoosters){
                    case 1:
                        nbOfDoubleBoosters++;
                        break;
                    case 2:
                        nbOfTrebleBoosters++;
                        break;
                    case 3:
                        nbOfQuadrupleBoosters++;
                        break;
                }
            }
            else{   //If the word we found was a hedge
                switch(nbOfConsecutiveHedges){
                    case 1:
                        nbOfDoubleHedges++;
                        break;
                    case 2:
                        nbOfTrebleHedges++;
                        break;
                    case 3:
                        nbOfQuadrupleHedges++;
                        break;
                }
            }
            
            //All cases of hedge+booster or booster+hedge are handles when a hedge or booster is found
            
            // The current word was not a hedge nor a booster, so we need to reset the number of consecutive/boosters
            nbOfConsecutiveBoosters = 0;
            nbOfConsecutiveHedges = 0 ;
        }
        else{
            //The current word is a hedge or booster. We need to check whether the previous word was, for a hedge, a booster, and for a booster, a hedge.
                
            if(isHedgeOrBooster == 0){ //If the word we found was an hedge
                nbOfConsecutiveHedges++;   // We now have +1 hedge in the current list of consecutive hedges.
                if(nbOfConsecutiveBoosters > 0){   //If we had at least one booster before, it's a case of Booster-->Hedge
                    nbOfBoosterHedges ++;
                }
                nbOfConsecutiveBoosters = 0; //Because the current word is not a booster, the current list of consecutive boosters is now 0
            }
                
            else{ //If the word we found was a booster
                nbOfConsecutiveBoosters++; // We now have +1 booster in the current list of consecutive booster.
                if(nbOfConsecutiveHedges > 0){   //If we had at least one hedge before, it's a case of Hedge-->Booster
                    nbOfHedgesBoosters ++;
                }
                nbOfConsecutiveHedges = 0; //Because the current word is not a hedge, the current list of consecutive hedges is now 0
            }
        }
        
        isHedgeOrBooster = -1;
    }
    //console.log("nbOfHedges = "+nbOfHedges)
    
    finalData.push([nbOfHedges,nbOfBoosters,nbOfBoosterHedges,nbOfHedgesBoosters,nbOfDoubleHedges,nbOfTrebleHedges,nbOfQuadrupleHedges,nbOfDoubleBoosters,nbOfTrebleBoosters,nbOfQuadrupleBoosters]);
    //console.dir(finalData);
    updateData (listOfKeywordFound,nbOfHedges,nbOfBoosters,nbOfBoosterHedges,nbOfHedgesBoosters,nbOfDoubleHedges,nbOfTrebleHedges,nbOfQuadrupleHedges,nbOfDoubleBoosters,nbOfTrebleBoosters,nbOfQuadrupleBoosters)
    //console.log("TEST")
}

function checkSentences(){
    var sentence = "One may possibly consider that it is extremely unlikely that the authors actually argued that it was almost never the case that A = B";
    checkSentence(sentence);
    /*for(var i = 0; i < data.length ; i++){
       checkSentence(data[i]);
    }*/
}

/*function addInflections(){
    var originalListLength = hedgesboosters.length ;
    for(var j = 0 ; j < originalListLength ; j++){
        // We need to check inflections of all words in the list
        // That requires using the type of the word (e.g., noun VS verb)
        // So that we can know which type of inflection we should use

        //listOfInflections = new Array();
        // For nouns, we need to check for the plural too
        if(hedgesboosters[j][2] == "Nouns"){
            doc = nlp(hedgesboosters[j][0]);
            doc.nouns(0).toPlural();
            var plural = doc.out('text');
            //console.log("Plural = "+plural)
            hedgesboosters.push([plural,hedgesboosters[j][1],hedgesboosters[j][2]]);
        }

        // For verbs, we need to check for other tenses, in particular present, gerund, past tense, participle, infinitive and present (3rd person)
        // Future is not necesseray, as it is "will + infinitive"
        else if(hedgesboosters[j][2] == "Lexical Verbs"){
            if(hedgesboosters[j][0] == "Knowing"){ //"Knowing" is not recognize                
                doc = nlp("Know");
                listOfTenses = doc.verbs(0).conjugate();
                //console.log("verb = "+hedgesboosters[j][0]);
                //console.dir(listOfTenses);
                //console.dir(listOfTenses[0].PastTense)

            }   
            else{
                doc = nlp(hedgesboosters[j][0]);
                listOfTenses = doc.verbs(0).conjugate();
                //console.log("verb = "+hedgesboosters[j][0]);
                //console.dir(listOfTenses);
                //console.dir(listOfTenses[0].PastTense)
            }
            //From the documentation: https://observablehq.com/@spencermountain/verbs
            //And the github: https://github.com/spencermountain/compromise
            //Object {PastTense: "threw", PresentTense: "throws", Infinitive: "throw", Gerund: "throwing", Actor: "thrower", Participle: "thrown", FutureTense: "will throw"}
            hedgesboosters.push([listOfTenses[0].PastTense,hedgesboosters[j][1],hedgesboosters[j][2]]);
            hedgesboosters.push([listOfTenses[0].Participle,hedgesboosters[j][1],hedgesboosters[j][2]]);
            //listOfInflections.push([listOfTenses[0].Gerund,hedgesboosters[j][1],hedgesboosters[j][2]]);   Is already in the list
            hedgesboosters.push([listOfTenses[0].PresentTense,hedgesboosters[j][1],hedgesboosters[j][2]]);
            hedgesboosters.push([listOfTenses[0].Infinitive,hedgesboosters[j][1],hedgesboosters[j][2]]);
           
            //console.dir(listOfInflections)
        }
        // Adjectives are invariate, so nothing to do there

        // Adverbs are also invariate

        // Boosters include negative verbs, so we need to contract them or expand them
        if(hedgesboosters[j][1] == "Booster" && hedgesboosters[j][2] == "Modal Verbs"){
            //console.log("Booster modal")
            //Special case of "have to" which is in the list and needs to be conjugated
            if (hedgesboosters[j][0] == "have to"){
                hedgesboosters.push(["had to",hedgesboosters[j][1],hedgesboosters[j][2]]);
                hedgesboosters.push(["have to",hedgesboosters[j][1],hedgesboosters[j][2]]);
                hedgesboosters.push(["has to",hedgesboosters[j][1],hedgesboosters[j][2]]);
                hedgesboosters.push(["having to",hedgesboosters[j][1],hedgesboosters[j][2]]);
            }
            else{
                doc = nlp(hedgesboosters[j][0]);
                doc.contractions().expand();
                hedgesboosters.push([doc.out('text'),hedgesboosters[j][1],hedgesboosters[j][2]]);
                //console.dir(doc.out('text'))
            }
        }
    }
    //console.dir(hedgesboosters)
}*/

/*function parseData(){
    //console.log("Parsing now");
    var listOfInflections;
    var doc;
    for(var i = 0; i < data.length ; i++){
        for(var j = 0 ; j < hedgesboosters.length ; j++){
            // We need to check inflections of all words in the list
            // That requires using the type of the word (e.g., noun VS verb)
            // So that we can know which type of inflection we should use
            
            listOfInflections = new Array();
            // For nouns, we need to check for the plural too
            if(hedgesboosters[j][2] == "Nouns"){
                doc = nlp(hedgesboosters[j][0]);
                doc.nouns(0).toPlural();
                var plural = doc.out('text');
                //console.log("Plural = "+plural)
                listOfInflections.push(hedgesboosters[j][0]);
                listOfInflections.push(plural);
                //console.dir(listOfInflections)
            }
            
            // For verbs, we need to check for other conjugation
            else if(hedgesboosters[j][2] == "Lexical Verbs"){
                doc = nlp(hedgesboosters[j][0]);
                listOfTenses = doc.verbs(0).conjugate();
                //console.log("verb = "+hedgesboosters[j][0]);
                //console.dir(listOfTenses);
                //console.dir(listOfTenses[0].PastTense)
                //From the documentation: https://observablehq.com/@spencermountain/verbs
                //And the github: https://github.com/spencermountain/compromise
                //Object {PastTense: "threw", PresentTense: "throws", Infinitive: "throw", Gerund: "throwing", Actor: "thrower", Participle: "thrown", FutureTense: "will throw"}
                listOfInflections.push(listOfTenses[0].PastTense);
                listOfInflections.push(listOfTenses[0].Participle);
                listOfInflections.push(listOfTenses[0].Gerund);
                listOfInflections.push(listOfTenses[0].PresentTense);
                listOfInflections.push(listOfTenses[0].Infinitive);
                //console.dir(listOfInflections)
            }
            // Adjectives are invariate, so nothing to do there
            
            // Adverbs are also invariate
            
            // Boosters include negative verbs, so we need to contract them or expand them
            if(hedgesboosters[j][1] == "Booster" && hedgesboosters[j][2] == "Modal Verbs"){
                //console.log("Booster modal")
                //Special case of "have to" which is in the list and needs to be conjugated
                if (hedgesboosters[j][0] == "have to"){
                    listOfInflections.push("had to");
                    listOfInflections.push("have to");
                    listOfInflections.push("has to");
                    listOfInflections.push("having to");
                }
                else{
                    doc = nlp(hedgesboosters[j][0]);
                    doc.contractions().expand();
                    listOfInflections.push(doc.out('text'));
                    listOfInflections.push(hedgesboosters[j][0]);
                    //console.dir(listOfInflections)
                }
            }
        }
    }
}*/


/**
  ******************************************
  * Helper functions for event listeners
  ******************************************
  */



function addSentenceToData(paper_year,paper_name,paper_study,section_type,sentence){
   
    data.push([paper_year,paper_name,paper_study,section_type,'"'+sentence+'"']);
    //console.dir(data)
}

function changeData(dataid){
    var indexOfBoolean = data[dataid].length -1
    //console.log("indexOfBoolean = "+indexOfBoolean)
    data[dataid][indexOfBoolean] = !data[dataid][indexOfBoolean]
    //console.dir(data[dataid])
}

function createClickHandler(row){
    return function() {
        var cell = row.getElementsByTagName("td")[1];
        var dataid = cell.getAttribute("data-id");
        //console.log("Id = "+dataid);
        changeData(dataid);
        updateUI(cell,dataid)
      };
}

function readList(){
    // var reader = new FileReader();
    // var results = null
    // reader.onload = function () {
        
    //     var jsonObject = reader.result.split(/\r?\n|\r/);
    //     for (var i = 1; i < jsonObject.length; i++) {
    //         data = jsonObject[i].split(',')
    //         listOfKeywords.push([data[0].toLowerCase(),data[1],data[2]]);
    //     }
    //     // setInterval(function() {
    //     //     saveCSV("back_up ")
    //     // }, 300000);
    //     //console.dir(listOfKeywords)
    //     //addInflections();
    //     //parseData();
    //     //console.log("Done reading list")
    //     computeDataAndUI();
    // }
    // start reading the file. When it is done, calls the onload event defined above.
    // reader.readAsText("list.csv");
    $.ajax({
        type: "GET",  
        url: "list.csv",
        dataType: "text",       
        success: function(response)  
        {
            data = $.csv.toArrays(response);
            for (var i = 1; i < data.length; i++) {
                // data = jsonObject[i].split(',')
                listOfKeywords.push([data[i][0].toLowerCase(),data[i][1],data[i][2]]);
            }
            computeDataAndUI();

        }
    });
}



function readFile() {
    var reader = new FileReader();
    var results = null
    var s = null ;
    var previousPaper = ""
    var previousLocation = ""
    var paper ;
    var location ;
    var sentenceIndex = 1;
    coderName = "alias";
    // getCoderName(fileInput.files[0].name);
    // reader.onload = function () {
    //     results = CSVToArray(reader.result,",")
    //     var jsonObject = reader.result.split(/\r?\n|\r/);
    //     for (var i = 1; i < jsonObject.length; i++) {
    //         if(jsonObject[i].includes(",,,")){
    //             year = jsonObject[i].replace(",,,","")
    //             continue;
    //         }
    //         data = jsonObject[i].split(',')
    //         csvData.push(year+","+jsonObject[i].split(','));
    //     }
        
    //     //console.dir(results)
        
    //     }
        
    //     //console.dir(listOfSentences)
        
    // };
    // start reading the file. When it is done, calls the onload event defined above.
    // reader.readAsText("step3.csv");
    $.ajax({
      type: "GET",  
      url: "step3.csv",
      dataType: "text",       
      success: function(response)  
      {
        results = $.csv.toArrays(response);
                for(var i = 1 ; i < results.length ; i++){
            //console.dir(results[i])
                if(results[i][0] != ""){
                    //console.log("results[i][0] = "+results[i][0])
                    //console.log("results[i][1] = "+results[i][1])
                    //console.log("results[i][2] = "+results[i][2])
                    //console.log("results[i][4] = "+results[i][3])
                    //s = new Sentence(results[i][0],results[i][1],results[i][2],results[i][4].toLowerCase(),(results[i][5] == 'true'));
                    paper = results[i][1]
                    location = results[i][2]
                    if(paper != previousPaper || location!=previousLocation){
                        sentenceIndex = 1
                    }
                    else{
                        sentenceIndex ++;
                    }
                    s = new Sentence(results[i][0],results[i][1],results[i][2],results[i][3],sentenceIndex);
                    previousLocation = location;
                    previousPaper = paper ;
                    listOfSentences.push(s);
                }
            }

      }   
    });
    // var secondFile = document.getElementById("list").style.visibility = "visible"
}


/**
  ******************************************
  * Helper functions for string operations
  ******************************************
  */

/**
 * CSVToArray parses any String of Data including '\r' '\n' characters,
 * and returns an array with the rows of data.
 * @param {String} CSV_string - the CSV string you need to parse
 * @param {String} delimiter - the delimeter used to separate fields of data
 * @returns {Array} rows - rows of CSV where first row are column headers
 */
function CSVToArray (CSV_string, delimiter) {
   delimiter = (delimiter || ","); // user-supplied delimeter or default comma

   var pattern = new RegExp( // regular expression to parse the CSV values.
     ( // Delimiters:
       "(\\" + delimiter + "|\\r?\\n|\\r|^)" +
       // Quoted fields.
       "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
       // Standard fields.
       "([^\"\\" + delimiter + "\\r\\n]*))"
     ), "gi"
   );

   var rows = [[]];  // array to hold our data. First row is column headers.
   // array to hold our individual pattern matching groups:
   var matches = false; // false if we don't find any matches
   // Loop until we no longer find a regular expression match
   while (matches = pattern.exec( CSV_string )) {
       var matched_delimiter = matches[1]; // Get the matched delimiter
       // Check if the delimiter has a length (and is not the start of string)
       // and if it matches field delimiter. If not, it is a row delimiter.
       if (matched_delimiter.length && matched_delimiter !== delimiter) {
         // Since this is a new row of data, add an empty row to the array.
         rows.push( [] );
       }
       var matched_value;
       // Once we have eliminated the delimiter, check to see
       // what kind of value was captured (quoted or unquoted):
       if (matches[2]) { // found quoted value. unescape any double quotes.
        matched_value = matches[2].replace(
          new RegExp( "\"\"", "g" ), "\""
        );
       } else { // found a non-quoted value
         matched_value = matches[3];
       }
       // Now that we have our value string, let's add
       // it to the data array.
       rows[rows.length - 1].push(matched_value);
   }
   return rows; // Return the parsed data Array
}


function splitIntoSentences(input){
    return input.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|")
    //See https://stackoverflow.com/questions/18914629/split-string-into-sentences-in-javascript
}



