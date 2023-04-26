export class GlobalConstants{
    //Mensajes
    public static genericError:string = "Algo salió mal. Por favor, inténtelo de nuevo más tarde.";

    public static unauthroized:string = "No eres una persona autorizada para acceder a esta página.";

    public static productExistError:string = "El producto ya existe.";

    public static productAdded:string = "Producto añadido con éxito.";

    //Regex
    public static nameRegex:string = "[a-zA-Z0-9 ]*";

    public static emailRegex:string = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}";

    public static contactNumberRegex:string = "^[e0-9]{10,10}$";

    //Variable
    public static error:string = "error";

}