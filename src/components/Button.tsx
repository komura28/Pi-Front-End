

 function Button() {
    function clicar() {
    alert("Curso cadastrado!");
  }
   return <button onClick={clicar} className="
        bg-blue-500
        hover:bg-blue-700
        text-white
        font-bold
        py-2
        px-4
        rounded
        cursor-pointer
      ">Clique aqui</button>;
}

export default Button ;