//   console.log(module);
  
//   function day(){
//     const options = { weekday: 'long',month: 'long', day: 'numeric'};

//     var today=new Date();
//     var day=new Intl.DateTimeFormat('en-US', options).format(today);
//     return day;
//   }

  export default getDate;
     
  function getDate() {
      let today = new Date();
      let options = {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
      };
   
      let day = today.toLocaleDateString('en-GB', options);
      return day
  }