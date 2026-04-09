package com.evalur;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
@EnableJpaAuditing
public class EvalurApplication {

	public static void main(String[] args) {
		// Load .env variables into system properties
        Dotenv dotenv = Dotenv.configure()
                .directory("./server/evalur/") 
                .ignoreIfMissing()
                .load();
        dotenv.entries().forEach(entry -> {
            System.setProperty(entry.getKey(), entry.getValue());
        });
      

		SpringApplication.run(EvalurApplication.class, args);
	}

}
