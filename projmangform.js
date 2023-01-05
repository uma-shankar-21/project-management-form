/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var jpdbBaseURL=' http://api.login2explore.com:5577';
var jpdbIRL='/api/irl';
var jpdbIML='/api/iml';
var projDBname="PROJECT-TABLE";
var projRelationName='COLLEGE-DB';
var connToken="90938196|-31949272995677959|90955139";

$('projid').focus();

function saveRecNo2Ls(jsonobj){
    var lvdata=JSON.parse(jsonobj.data);
    localStorage.setItem('recno',lvdata.rec_no);
}

function getProjIdAsJsonObj(){
    var projid =$('projid').val();
    var jsonStr={
        id: projid
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonobj){
    saveRecNo2LS(jsonobj);
    var data=JSON.parse(jsonobj.data).record;
    $('#projid').val(data.projectid);
    $('#projname').val(data.projectname);
    $('#asignto').val(data.assignto);
    $('#asigndate').val(data.assigndate);
    $('#dedlin').val(data.deadline);
}

function resetForm(){
    $('#projid').val("");
    $('#projname').val("");
    $('#asignto').val("");
    $('#asigndate').val("");
    $('#dedlin').val("");
    $('#projid').prop("disabled",false);
    $('#save').prop("disabled",true);
    $('#change').prop("disabled",true);
    $('#reset').prop("disabled",true);
    $('#projid').focus();
}

function validateData()
{
    var projid,projname,asignto,asigndate,dedlin;
    projid=$('#projid').val();
    projname=$('#projname').val();
    asignto=$('#asignto').val();
    asigndate=$('#asigndate').val();
    dedlin=$('#dedlin').val();
    
    if(projid==''){
        alert('Project Id Missing');
        $('#projid').focus();
        return "";
    }
    if(projname==''){
        alert('Project Name Missing');
        $('#projname').focus();
        return "";
    }
    if(asignto==''){
        alert('Assigned To Missing');
        $('#asignto').focus();
        return "";
    }
    if(asigndate==''){
        alert('Assignment Date Missing');
        $('#asigndate').focus();
        return "";
    }
    if(dedlin==''){
        alert('DeadLine Missing');
        $('#dedlin').focus();
        return "";
    }
    
    var jsonstrobj={
        id: projid,
        name: projname,
        assignedto:asignto,
        assigndate:asigndate,
        deadline:dedlin,
    };
    return JSON.stringify(jsonstrobj);
}
 
function getProj(){
    var projidJsonobj = getProjIdAsJsonObj();
    var getRequest =createGET_BY_KEYRequest(connToken,projDBname,projRelationName,projidJsonobj);
    jQuery.ajaxSetup({async:false});
    var resJsonobj=executeCommandAtGivenBaseUrl(getRequest,jpdbBaseURL,jpdbIRL);
    jQuery.ajaxSetup({async:true});
    if(resJsonobj.status==400){
        $('#save').prop("disabled",false);
        $('#reset').prop("disabled",false);
        $("#projname").focus();
    }
    else if(resJsonobj.status==200){
        $("projid").prop("disabled",true);
        fillData(resJsonobj);
        
        $('#change').prop("disabled",false);
        $('#reset').prop("disabled",false);
        $("#projname").focus();
    }
}

function saveData(){
    var jsonstrobj=validateData();
    if (jsonstrobj===""){
        return "";
    }
    var putRequest =createPUTRequest(connToken,jsonstrobj,projDBname,projRelationName);
    jQuery.ajaxSetup({async:false});
    var resJsonobj=executeCommandAtGivenBaseUrl(putRequest,jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async:true});
    resetForm();
    $('projid').focus();
}
function changeData(){
    $("#change").prop("disabled",true);
    jsonchg=validateData();
    var updateRequest =createUPDATERecordRequest(connToken,jsonchg,projDBname,projRelationName,localStorage.getItem('recno') );
    jQuery.ajaxSetup({async:false});
    var resJsonobj=executeCommandAtGivenBaseUrl(updateRequest,jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async:true});
    console.log(resJsonobj);
    resetForm();
    $('projid').focus();
}
