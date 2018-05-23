package com.ncgroup2.eventmanager.authorization.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.ncgroup2.eventmanager.authorization.model.AuthResponse;
import com.ncgroup2.eventmanager.authorization.model.UserAuthParam;
import com.ncgroup2.eventmanager.authorization.service.TokenGenerator;
import com.ncgroup2.eventmanager.entity.Customer;
import com.ncgroup2.eventmanager.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;

@RestController
@RequestMapping("/api")
public class AuthorizationController {

    private static final String GOOGLE_CLIENT_ID = "882385907365-t3b1b4nieo5c2rna6ejf862eadkho2s2.apps.googleusercontent.com";
    private final TokenGenerator tokenGenerator;
    private AuthenticationManager authenticationManager;
    private CustomerService customerService;

    @Autowired
    public AuthorizationController(TokenGenerator tokenGenerator, AuthenticationManager authenticationManager, CustomerService customerService) {
        this.tokenGenerator = tokenGenerator;
        this.authenticationManager = authenticationManager;
        this.customerService = customerService;
    }

    @PostMapping("/auth")
    public AuthResponse login(@RequestBody UserAuthParam userAuthParam) throws AuthenticationException {
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(userAuthParam.getLogin(), userAuthParam.getPassword());
        Authentication authentication = authenticationManager.authenticate(usernamePasswordAuthenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        Customer customer = customerService.findByLogin(SecurityContextHolder.getContext().getAuthentication().getName());
        String token = tokenGenerator.generateToken(customer);
        return new AuthResponse(token);
    }

    @PostMapping("/auth/google")
    public AuthResponse googleLogin(@RequestBody String token) throws Exception {

        NetHttpTransport transport = GoogleNetHttpTransport.newTrustedTransport();

        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, JacksonFactory.getDefaultInstance())
                // Specify the CLIENT_ID of the app that accesses the backend:
                .setAudience(Collections.singletonList(GOOGLE_CLIENT_ID))
                .build();

// (Receive idTokenString by HTTPS POST)

        GoogleIdToken idToken = verifier.verify(token);
        if (idToken != null) {
            Payload payload = idToken.getPayload();

            // Print user identifier
            String googleId = payload.getSubject();
            System.out.println("User ID: " + googleId);
            System.out.println("Hey");

            Customer customer = customerService.getByGoogleId(googleId);
            try {
                String JWTToken = tokenGenerator.generateToken(customer);
                return new AuthResponse(JWTToken);
            } catch (NullPointerException e) {
                throw new AuthenticationCredentialsNotFoundException("Invalid token");
            }

        } else {
            throw new AuthenticationCredentialsNotFoundException("Invalid token");
        }

    }
}
