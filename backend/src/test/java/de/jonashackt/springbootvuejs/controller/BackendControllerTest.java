package de.jonashackt.springbootvuejs.controller;

import io.restassured.RestAssured;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;

import mvp.match.vendingmachine.SpringBootVuejsApplication;

import static io.restassured.RestAssured.given;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

@SpringBootTest(classes = SpringBootVuejsApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class BackendControllerTest {

	@LocalServerPort
	private int port;

	@BeforeEach
	public void init() {
		RestAssured.baseURI = "http://localhost";
		RestAssured.port = port;
	}

	// @Test
	// public void saysHello() {
	// when().get("/api/hello").then().statusCode(HttpStatus.SC_OK).assertThat()
	// .body(is(equalTo(BackendController.HELLO_TEXT)));
	// }

	// @Test
	// public void addNewUserAndRetrieveItBack() {
	// User norbertSiegmund = new User("Norbert", "Siegmund");
	// String norbertSiegmundJson = "{\n" + " \"firstName\": \"Norbert\",\n" + "
	// \"lastName\": \"Siegmund\"\n"
	// + "\n}";

	// Response responseCreate = given().header("Content-type",
	// "application/json").and().body(norbertSiegmundJson)
	// .when().post("/api/user/create").then().extract().response();

	// assertThat(201, is(responseCreate.statusCode()));
	// assertThat("Norbert", is(responseCreate.jsonPath().getString("firstName")));
	// assertThat("Siegmund", is(responseCreate.jsonPath().getString("lastName")));

	// User responseGet = given().pathParam("id",
	// responseCreate.jsonPath().getString("id")).when()
	// .get("/api/user/{id}").then().extract().as(User.class);

	// // Did Norbert came back?
	// assertThat(responseGet.getFirstName(), is("Norbert"));
	// assertThat(responseGet.getLastName(), is("Siegmund"));
	// }

	// @Test
	// public void
	// user_api_should_give_http_404_not_found_when_user_not_present_in_db() {
	// Long someId = 200L;
	// given().pathParam("id",
	// someId).when().get("/api/user/{id}").then().statusCode(HttpStatus.SC_NOT_FOUND);
	// }

	// @Test
	// public void secured_api_should_react_with_unauthorized_per_default() {

	// given().when().get("/api/secured").then().statusCode(HttpStatus.SC_UNAUTHORIZED);
	// }

	// @Test
	// public void secured_api_should_give_http_200_when_authorized() {

	// given().auth().basic("sina",
	// "miller").when().get("/api/secured").then().statusCode(HttpStatus.SC_OK)
	// .assertThat().body(is(equalTo(BackendController.SECURED_TEXT)));
	// }

}
