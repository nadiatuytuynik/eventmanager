package com.ncgroup2.eventmanager.service.sender;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
public class Sender {

    @Autowired
    private JavaMailSender mailSender;

    private String recipientAddress;

    private String subject;

    private String confirmationUrl;

    private String text;

    public void sendEmail(String recipientAddress, SubjectEnum subjectEnum, String token) {

        String message = "Confirmation link: \n";
//        String hosting = "https://rocky-dusk-73382.herokuapp.com";
        String hosting = "localhost:8090";

        this.recipientAddress = recipientAddress;

        switch (subjectEnum){

            case REGISTRATION: {
                this.subject = "Registration";
                this.confirmationUrl = "/registrationConfirm";

            } break;

            case FRIEND_REQUEST: {
                this.subject = "Friend request";
                this.confirmationUrl = "/acceptRequest";

            } break;

            case RESET_PASSWORD: {
                this.subject = "Reset password";
                this.confirmationUrl = "/resetPassword";

            } break;

            case EVENT_NOTIFICATION: {
                this.subject = "Request to event";
                this.confirmationUrl = "/acceptRequest";

            } break;
        }

        this.subject += " confirmation";

        this.confirmationUrl += "?token=" + token;

        this.text = message + hosting + confirmationUrl;

        send();

    }

    private void send() {

        SimpleMailMessage email = new SimpleMailMessage();

        email.setTo(recipientAddress);

        email.setSubject(subject);

        email.setText(text);

        mailSender.send(email);

    }
}
