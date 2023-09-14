export const validateEmail = (email: string) : string | undefined => {
    var validRegex = 
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


    if(!email.length || !validRegex.test(email)){
        return 'Please enter a valid email address'
    }
};

export const validatePassword = (password: string) : string | undefined => {
    if(password.length < 5){
       return 'Please enter a valid password which is of lenght 5 and above';
    }
};
