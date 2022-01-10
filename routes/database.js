var sql = require("mssql");

/*
var db_config = {
    server: "172.28.100.109",
  	user: "usrWuhutech",
  	password: "Vrcrrea0",
  	database: "ControlPpto",
  	options: {
	    enableArithAbort: true,
	    encrypt: false
	},
	port: 1433,
};



var db_config = {
    server: "localhost",
  	user: "sa",
  	password: "Vrcrrea0",
  	database: "wht_cdp",
  	options: {
	    enableArithAbort: true,
	    encrypt: false
	},
	port: 1433,
};
*/

var db_config = {
    server: "sql.lobby.rocks",
  	user: "ernesto.cruz",
  	password: "BbAW4kVkz83WQYwU",
  	database: "verzatec-presupuestos",
  	options: {
	    enableArithAbort: true,
	    encrypt: false
	},
	port: 1433,
};
var schema = '';
//var schema = 'wht_cdp.';

var con;

bodyParser = require('body-parser'),
jwt = require('jsonwebtoken'),
llave = "miclaveultrasecreta123*",

module.exports ={

	autenticar :function(req,res){
		var user = req.body.user;
	    var password = req.body.password;

	    try{
	    	sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();
		        const query = "SELECT * FROM "+schema+"users WHERE employee_number = '"+user+"' AND password = '"+password+"'";

			    con.query(query, function (err, result){

			    	if (err) throw err;

			    	

			    	if (result.recordset.length > 0) {
			    		const payload = {
				           check:  true
				        };

				        const token = jwt.sign(payload, llave, {
				           expiresIn: '10h'
				        });

				        con.query("UPDATE "+schema+"users SET token = '"+token+"' WHERE id_user = "+result.recordset[0].id_user);

				        if (result.recordset[0].user_type == 2){
				        	customer = 'ALL';
				        }

				        res.json({
				           commercial_zone: result.recordset[0].commercial_zone,
				           id_user: result.recordset[0].id_user,
				           employee_name: result.recordset[0].employee_name,
				           user_type: result.recordset[0].user_type,
				           token: token
				        });

			    	}else{
			    		res.json({ token: 400})
			    	}
				    
				});
		           
		        
		    });

	    }catch (error) {
			res.status(500).json({error});
		}
	},

	get_product_lines: function(req, res){

		var domos_type = req.param('domos_type');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

				const query = "SELECT product_line FROM "+schema+"product_lines WHERE domos_type = "+domos_type+" ORDER BY orden ASC";

				con.query(query, (err, result, fields) => {
				    if (err) throw err;

				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_all_product_lines: function(req, res){

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

				const query = "SELECT orden, product_line FROM "+schema+"product_lines ORDER BY orden ASC";

				con.query(query, (err, result, fields) => {
				    if (err) throw err;

				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_orden_product_line: function(req, res){

		var product_line = req.param('product_line');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

				const query = "SELECT orden, product_line FROM "+schema+"product_lines WHERE product_line = '"+product_line+"' ORDER BY orden ASC";

				con.query(query, (err, result, fields) => {
				    if (err) throw err;

				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_count_product_lines: function(req, res){
		var domos_type = req.param('domos_type');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

				const query = "SELECT COUNT(id_product_line) AS count FROM "+schema+"product_lines WHERE domos_type = "+domos_type;
				

				con.query(query, (err, result, fields) => {
				    if (err) throw err;

				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_customer_name: function(req, res){
		var customer_id = req.param('customer_id');

		try{

			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

				const query = "SELECT customer FROM "+schema+"customers WHERE customer_id = "+customer_id+" ";

				con.query(query, (err, result, fields) => {
				    if (err) throw err;

				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_customer_id: function(req, res){
		var customer_name = req.param('customer_name');

		try{

			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

				//const query = "SELECT customer FROM "+schema+"customers WHERE customer = '"+customer_name+"' ";

				const query = "SELECT customer_id FROM "+schema+"customers WHERE customer = '"+customer_name+"' ";

				con.query(query, (err, result, fields) => {
				    if (err) throw err;

				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},


	get_meses_by_product: function(req, res){
		var product_line = req.param('product_line');
		
		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();
				const query = "SELECT DISTINCT product_line as pl,(SELECT SUM(qty_m2) AS meses FROM "+schema+"budget_period WHERE product_line = 'GLASLINER' AND month = 1) as ene, (SELECT SUM(qty_m2) AS meses FROM "+schema+"budget_period WHERE product_line = 'GLASLINER' AND month = 2) as feb, (SELECT SUM(qty_m2) AS meses FROM "+schema+"budget_period WHERE product_line = 'GLASLINER' AND month = 3) as mar, (SELECT SUM(qty_m2) AS meses FROM "+schema+"budget_period WHERE product_line = 'GLASLINER' AND month = 4) as abr, (SELECT SUM(qty_m2) AS meses FROM "+schema+"budget_period WHERE product_line = 'GLASLINER' AND month = 5) as may, (SELECT SUM(qty_m2) AS meses FROM "+schema+"budget_period WHERE product_line = 'GLASLINER' AND month = 6) as jun, (SELECT SUM(qty_m2) AS meses FROM "+schema+"budget_period WHERE product_line = 'GLASLINER' AND month = 7) as jul, (SELECT SUM(qty_m2) AS meses FROM "+schema+"budget_period WHERE product_line = 'GLASLINER' AND month = 8) as ago, (SELECT SUM(qty_m2) AS meses FROM "+schema+"budget_period WHERE product_line = 'GLASLINER' AND month = 9) as sep, (SELECT SUM(qty_m2) AS meses FROM "+schema+"budget_period WHERE product_line = 'GLASLINER' AND month = 10) as oct, (SELECT SUM(qty_m2) AS meses FROM "+schema+"budget_period WHERE product_line = 'GLASLINER' AND month = 11) as nov, (SELECT SUM(qty_m2) AS meses FROM "+schema+"budget_period WHERE product_line = 'GLASLINER' AND month = 12) as dic FROM "+schema+"budget_period WHERE product_line = 'GLASLINER'";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},



	get_budget_period_by_year: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var commercial_zone = req.param('commercial_zone');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();
				//*** 11 + 1 ///const query = "SELECT product_line AS 'PRODUCTO',(SELECT ISNULL(ROUND(SUM(m2),2),0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+") AS 'ENE', (SELECT ISNULL(ROUND(SUM(m2),2),0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+") AS 'FEB', (SELECT ISNULL(ROUND(SUM(m2),2),0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+") AS 'MAR', (SELECT ISNULL(ROUND(SUM(m2),2),0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+") AS 'ABR', (SELECT ISNULL(ROUND(SUM(m2),2),0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+") AS 'MAY', (SELECT ISNULL(ROUND(SUM(m2),2),0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+") AS 'JUN', (SELECT ISNULL(ROUND(SUM(m2),2),0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+") AS 'JUL', (SELECT ISNULL(ROUND(SUM(m2),2),0) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+") AS 'AGO', (SELECT ISNULL(ROUND(SUM(m2),2),0) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+") AS 'SEP', (SELECT ISNULL(ROUND(SUM(m2),2),0) FROM "+schema+"budget_period_group WHERE month = 10 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+") AS 'OCT', (SELECT ISNULL(ROUND(SUM(m2),2),0) FROM "+schema+"budget_period_group WHERE month = 11 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+") AS 'NOV', (SELECT ISNULL(ROUND((SUM(m2)/11),2),0) FROM "+schema+"budget_period_group WHERE month < 12 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+") AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line";
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") AS 'ENE', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") AS 'FEB', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") AS 'MAR', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") AS 'ABR', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") AS 'MAY', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") AS 'JUN', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") AS 'JUL', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") AS 'AGO', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") AS 'SEP', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 10 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") AS 'OCT', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 11 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") AS 'NOV', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 12 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_forecast_by_year: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');
		var forecast = req.param('forecast');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT PRODUCT_LINE AS 'PRODUCTO', MAX(ENE) AS ENE, MAX(FEB) AS FEB, MAX(MAR) AS MAR, MAX(ABR) AS ABR, MAX(MAY) AS MAY, MAX(JUN) AS JUN, MAX(JUL) AS JUL, MAX(AGO) AS AGO, MAX(SEP) AS SEP, MAX(OCT) AS OCT, MAX(NOV) AS NOV, MAX(DIC) AS DIC FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND customer_id = '"+customer+"' AND forecast = '"+forecast+"' GROUP BY PRODUCT_LINE ";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
					
						
				
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_exist_forecast_by_year: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var commercial_zone = req.param('commercial_zone');
		var forecast = req.param('forecast');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT PRODUCT_LINE AS 'PRODUCTO', MAX(ENE) AS ENE, MAX(FEB) AS FEB, MAX(MAR) AS MAR, MAX(ABR) AS ABR, MAX(MAY) AS MAY, MAX(JUN) AS JUN, MAX(JUL) AS JUL, MAX(AGO) AS AGO, MAX(SEP) AS SEP, MAX(OCT) AS OCT, MAX(NOV) AS NOV, MAX(DIC) AS DIC FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = '"+forecast+"' AND year = '"+year+"' GROUP BY PRODUCT_LINE ";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
					
						
				
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},


	check_if_exist_forecast_con_cc: function(req,res){
	  	var customer = req.param('customer');
	  	var year = req.param('year');
	  	var forecast = req.param('forecast');
	  	
	  	try{
		  	sql.connect(db_config, function (err) {
		    
			    if (err) console.log(err);

			    con = new sql.Request();
			  	const query = "SELECT DISTINCT customer_id FROM "+schema+"forecast_con_cc WHERE customer_id = '"+customer+"' AND YEAR = "+year+" AND FORECAST = "+forecast;
			  	
			  	con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;
				    
				    res.setHeader('Content-Type', 'application/json');
			   		res.end(JSON.stringify(result.recordset));


				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},


	get_presupuesto: function(req, res){
		var year = req.param('year');
		var commercial_zone = req.param('commercial_zone');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT 'm2 Presupuesto "+year+"' AS 'PRODUCTO', SUM(ene) AS ENE, SUM(feb) AS FEB,SUM(mar) AS MAR,SUM(abr) AS ABR,SUM(may) AS MAY,SUM(jun) AS JUN,SUM(jul) AS JUL,SUM(ago) AS AGO,SUM(sep) AS SEP,SUM(oct) AS OCT,SUM(nov) AS NOV,SUM(dic) AS DIC FROM "+schema+"presupuestos WHERE periodo = "+year+" AND commercial_zone = '"+commercial_zone+"'";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
					
						
				
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_presupuesto_cc: function(req, res){
		var year = req.param('year');
		var customer = req.param('customer');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT 'Presupuesto' AS 'PRODUCTO', SUM(ene) AS ENE, SUM(feb) AS FEB,SUM(mar) AS MAR,SUM(abr) AS ABR,SUM(may) AS MAY,SUM(jun) AS JUN,SUM(jul) AS JUL,SUM(ago) AS AGO,SUM(sep) AS SEP,SUM(oct) AS OCT,SUM(nov) AS NOV,SUM(dic) AS DIC FROM "+schema+"presupuestos_cc WHERE periodo = "+year+" AND customer_id = '"+customer+"'";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
					
						
				
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_presupuesto_by_line: function(req, res){
		var year = req.param('year');
		var commercial_zone = req.param('commercial_zone');
		var product_line = req.param('product_line');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT SUM(tot) AS TOT FROM "+schema+"presupuestos WHERE periodo = "+year+" AND commercial_zone = '"+commercial_zone+"' AND product_line  = '"+product_line+"'";


				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
					
						
				
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_presupuesto_by_line_cc: function(req, res){
		var year = req.param('year');
		var customer = req.param('customer');
		var product_line = req.param('product_line');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT SUM(tot) AS TOT FROM "+schema+"presupuestos_cc WHERE periodo = "+year+" AND customer_id = '"+customer+"' AND product_line  = '"+product_line+"'";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
					
						
				
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},



	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/********************************************* Configuraciones por meses CCVE *************************************************/
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**************************************************** 12 CC *********************************************************/

	get_budget_period_by_year_forecast_12: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'SEP', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 10 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'OCT', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 11 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'NOV', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 12 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
					
						
				
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_by_year_forecast_12_cc: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				//const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'SEP', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 10 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'OCT', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 11 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'NOV', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 12 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line";
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'SEP', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 10 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'OCT', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 11 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'NOV', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 12 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id = '"+customer+"' GROUP BY product_line ";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
					
						
				
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	/**************************************************** 11 CC *********************************************************/

	get_budget_period_by_year_forecast_11: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'SEP', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 10 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'OCT', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 11 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'NOV', (SELECT Isnull(Round(Sum(m2) / 11, 2), 0) FROM "+schema+"budget_period_group WHERE month < 12 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line";
				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
					
						
				
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_by_year_forecast_11_cc: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();
					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'SEP', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 10 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'OCT', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 11 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'NOV', (SELECT Isnull(Round(Sum(m2) / 11, 2), 0) FROM "+schema+"budget_period_group WHERE month < 12 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id = '"+customer+"' GROUP BY product_line";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	/**************************************************** 10 CC *********************************************************/

	get_budget_period_by_year_forecast_10: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'SEP', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 10 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'OCT', (SELECT Isnull(Round(Sum(m2) / 10, 2), 0) FROM "+schema+"budget_period_group WHERE month < 11 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'NOV', (SELECT Isnull(Round(Sum(m2) / 10, 2), 0) FROM "+schema+"budget_period_group WHERE month < 11 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_by_year_forecast_10_cc: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'SEP', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 10 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'OCT', (SELECT Isnull(Round(Sum(m2) / 10, 2), 0) FROM "+schema+"budget_period_group WHERE month < 11 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'NOV', (SELECT Isnull(Round(Sum(m2) / 10, 2), 0) FROM "+schema+"budget_period_group WHERE month < 11 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id = '"+customer+"' GROUP BY product_line";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
					
						
				
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	/**************************************************** 9 CC *********************************************************/

	get_budget_period_by_year_forecast_9: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'SEP', (SELECT Isnull(Round(Sum(m2) / 9, 2), 0) FROM "+schema+"budget_period_group WHERE month < 10 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'OCT', (SELECT Isnull(Round(Sum(m2) / 9, 2), 0) FROM "+schema+"budget_period_group WHERE month < 10 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'NOV', (SELECT Isnull(Round(Sum(m2) / 9, 2), 0) FROM "+schema+"budget_period_group WHERE month < 10 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_by_year_forecast_9_cc: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'SEP', (SELECT Isnull(Round(Sum(m2) / 9, 2), 0) FROM "+schema+"budget_period_group WHERE month < 10 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'OCT', (SELECT Isnull(Round(Sum(m2) / 9, 2), 0) FROM "+schema+"budget_period_group WHERE month < 10 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'NOV', (SELECT Isnull(Round(Sum(m2) / 9, 2), 0) FROM "+schema+"budget_period_group WHERE month < 10 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id = '"+customer+"' GROUP BY product_line";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});	
				
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	/**************************************************** 8 CC *********************************************************/

	get_budget_period_by_year_forecast_8: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2) / 8, 2), 0) FROM "+schema+"budget_period_group WHERE month < 9 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'SEP', (SELECT Isnull(Round(Sum(m2) / 8, 2), 0) FROM "+schema+"budget_period_group WHERE month < 9 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'OCT', (SELECT Isnull(Round(Sum(m2) / 8, 2), 0) FROM "+schema+"budget_period_group WHERE month < 9 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'NOV', (SELECT Isnull(Round(Sum(m2) / 8, 2), 0) FROM "+schema+"budget_period_group WHERE month < 9 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line";
				//const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"forecast_con WHERE month = 9 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = 7) AS 'SEP', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"forecast_con WHERE month = 10 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = 7) AS 'OCT', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"forecast_con WHERE month = 11 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = 7) AS 'NOV', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"forecast_con WHERE month = 12 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = 7) AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});	
				
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},


	get_budget_period_by_year_forecast_8_cc: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2) / 8, 2), 0) FROM "+schema+"budget_period_group WHERE month < 9 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'SEP', (SELECT Isnull(Round(Sum(m2) / 8, 2), 0) FROM "+schema+"budget_period_group WHERE month < 9 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'OCT', (SELECT Isnull(Round(Sum(m2) / 8, 2), 0) FROM "+schema+"budget_period_group WHERE month < 9 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'NOV', (SELECT Isnull(Round(Sum(m2) / 8, 2), 0) FROM "+schema+"budget_period_group WHERE month < 9 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id = '"+customer+"' GROUP BY product_line";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
					
						
				
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	/**************************************************** 7 cc *********************************************************/

	get_budget_period_by_year_forecast_7: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2) / 7, 2), 0) FROM "+schema+"budget_period_group WHERE month < 8 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2) / 7, 2), 0) FROM "+schema+"budget_period_group WHERE month < 8 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'SEP', (SELECT Isnull(Round(Sum(m2) / 7, 2), 0) FROM "+schema+"budget_period_group WHERE month < 8 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'OCT', (SELECT Isnull(Round(Sum(m2) / 7, 2), 0) FROM "+schema+"budget_period_group WHERE month < 8 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'NOV', (SELECT Isnull(Round(Sum(m2) / 7, 2), 0) FROM "+schema+"budget_period_group WHERE month < 8 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});	
				
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},	


	get_budget_period_by_year_forecast_7_cc: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2) / 7, 2), 0) FROM "+schema+"budget_period_group WHERE month < 8 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2) / 7, 2), 0) FROM "+schema+"budget_period_group WHERE month < 8 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'SEP', (SELECT Isnull(Round(Sum(m2) / 7, 2), 0) FROM "+schema+"budget_period_group WHERE month < 8 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'OCT', (SELECT Isnull(Round(Sum(m2) / 7, 2), 0) FROM "+schema+"budget_period_group WHERE month < 8 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'NOV', (SELECT Isnull(Round(Sum(m2) / 7, 2), 0) FROM "+schema+"budget_period_group WHERE month < 8 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id = '"+customer+"' GROUP BY product_line";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	/**************************************************** 6 cc *********************************************************/

	get_budget_period_by_year_forecast_6: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2) / 6, 2), 0) FROM "+schema+"budget_period_group WHERE month < 7 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2) / 6, 2), 0) FROM "+schema+"budget_period_group WHERE month < 7 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2) / 6, 2), 0) FROM "+schema+"budget_period_group WHERE month < 7 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'SEP', (SELECT Isnull(Round(Sum(m2) / 6, 2), 0) FROM "+schema+"budget_period_group WHERE month < 7 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'OCT', (SELECT Isnull(Round(Sum(m2) / 6, 2), 0) FROM "+schema+"budget_period_group WHERE month < 7 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'NOV', (SELECT Isnull(Round(Sum(m2) / 6, 2), 0) FROM "+schema+"budget_period_group WHERE month < 7 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_by_year_forecast_6_cc: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2) / 6, 2), 0) FROM "+schema+"budget_period_group WHERE month < 7 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2) / 6, 2), 0) FROM "+schema+"budget_period_group WHERE month < 7 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2) / 6, 2), 0) FROM "+schema+"budget_period_group WHERE month < 7 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'SEP', (SELECT Isnull(Round(Sum(m2) / 6, 2), 0) FROM "+schema+"budget_period_group WHERE month < 7 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'OCT', (SELECT Isnull(Round(Sum(m2) / 6, 2), 0) FROM "+schema+"budget_period_group WHERE month < 7 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'NOV', (SELECT Isnull(Round(Sum(m2) / 6, 2), 0) FROM "+schema+"budget_period_group WHERE month < 7 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id = '"+customer+"' GROUP BY product_line";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	/**************************************************** 5 cc *********************************************************/

	get_budget_period_by_year_forecast_5: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2) / 5, 2), 0) FROM "+schema+"budget_period_group WHERE month < 6 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2) / 5, 2), 0) FROM "+schema+"budget_period_group WHERE month < 6 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2) / 5, 2), 0) FROM "+schema+"budget_period_group WHERE month < 6 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2) / 5, 2), 0) FROM "+schema+"budget_period_group WHERE month < 6 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'SEP', (SELECT Isnull(Round(Sum(m2) / 5, 2), 0) FROM "+schema+"budget_period_group WHERE month < 6 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'OCT', (SELECT Isnull(Round(Sum(m2) / 5, 2), 0) FROM "+schema+"budget_period_group WHERE month < 6 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'NOV', (SELECT Isnull(Round(Sum(m2) / 5, 2), 0) FROM "+schema+"budget_period_group WHERE month < 6 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_by_year_forecast_5_cc: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2) / 5, 2), 0) FROM "+schema+"budget_period_group WHERE month < 6 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2) / 5, 2), 0) FROM "+schema+"budget_period_group WHERE month < 6 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2) / 5, 2), 0) FROM "+schema+"budget_period_group WHERE month < 6 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2) / 5, 2), 0) FROM "+schema+"budget_period_group WHERE month < 6 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'SEP', (SELECT Isnull(Round(Sum(m2) / 5, 2), 0) FROM "+schema+"budget_period_group WHERE month < 6 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'OCT', (SELECT Isnull(Round(Sum(m2) / 5, 2), 0) FROM "+schema+"budget_period_group WHERE month < 6 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'NOV', (SELECT Isnull(Round(Sum(m2) / 5, 2), 0) FROM "+schema+"budget_period_group WHERE month < 6 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id = '"+customer+"' GROUP BY product_line";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
				
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	/**************************************************** 4 cc *********************************************************/

	get_budget_period_by_year_forecast_4: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2) / 4, 2), 0) FROM "+schema+"budget_period_group WHERE month < 5 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2) / 4, 2), 0) FROM "+schema+"budget_period_group WHERE month < 5 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2) / 4, 2), 0) FROM "+schema+"budget_period_group WHERE month < 5 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2) / 4, 2), 0) FROM "+schema+"budget_period_group WHERE month < 5 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2) / 4, 2), 0) FROM "+schema+"budget_period_group WHERE month < 5 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'SEP', (SELECT Isnull(Round(Sum(m2) / 4, 2), 0) FROM "+schema+"budget_period_group WHERE month < 5 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'OCT', (SELECT Isnull(Round(Sum(m2) / 4, 2), 0) FROM "+schema+"budget_period_group WHERE month < 5 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'NOV', (SELECT Isnull(Round(Sum(m2) / 4, 2), 0) FROM "+schema+"budget_period_group WHERE month < 5 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_by_year_forecast_4_cc: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2) / 4, 2), 0) FROM "+schema+"budget_period_group WHERE month < 5 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2) / 4, 2), 0) FROM "+schema+"budget_period_group WHERE month < 5 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2) / 4, 2), 0) FROM "+schema+"budget_period_group WHERE month < 5 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2) / 4, 2), 0) FROM "+schema+"budget_period_group WHERE month < 5 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2) / 4, 2), 0) FROM "+schema+"budget_period_group WHERE month < 5 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'SEP', (SELECT Isnull(Round(Sum(m2) / 4, 2), 0) FROM "+schema+"budget_period_group WHERE month < 5 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'OCT', (SELECT Isnull(Round(Sum(m2) / 4, 2), 0) FROM "+schema+"budget_period_group WHERE month < 5 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'NOV', (SELECT Isnull(Round(Sum(m2) / 4, 2), 0) FROM "+schema+"budget_period_group WHERE month < 5 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id = '"+customer+"' GROUP BY product_line";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	/**************************************************** 3 cc *********************************************************/

	get_budget_period_by_year_forecast_3: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2) / 3, 2), 0) FROM "+schema+"budget_period_group WHERE month < 4 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2) / 3, 2), 0) FROM "+schema+"budget_period_group WHERE month < 4 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2) / 3, 2), 0) FROM "+schema+"budget_period_group WHERE month < 4 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2) / 3, 2), 0) FROM "+schema+"budget_period_group WHERE month < 4 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2) / 3, 2), 0) FROM "+schema+"budget_period_group WHERE month < 4 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2) / 3, 2), 0) FROM "+schema+"budget_period_group WHERE month < 4 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'SEP', (SELECT Isnull(Round(Sum(m2) / 3, 2), 0) FROM "+schema+"budget_period_group WHERE month < 4 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'OCT', (SELECT Isnull(Round(Sum(m2) / 3, 2), 0) FROM "+schema+"budget_period_group WHERE month < 4 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'NOV', (SELECT Isnull(Round(Sum(m2) / 3, 2), 0) FROM "+schema+"budget_period_group WHERE month < 4 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_by_year_forecast_3_cc: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2) / 3, 2), 0) FROM "+schema+"budget_period_group WHERE month < 4 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2) / 3, 2), 0) FROM "+schema+"budget_period_group WHERE month < 4 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2) / 3, 2), 0) FROM "+schema+"budget_period_group WHERE month < 4 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2) / 3, 2), 0) FROM "+schema+"budget_period_group WHERE month < 4 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2) / 3, 2), 0) FROM "+schema+"budget_period_group WHERE month < 4 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2) / 3, 2), 0) FROM "+schema+"budget_period_group WHERE month < 4 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'SEP', (SELECT Isnull(Round(Sum(m2) / 3, 2), 0) FROM "+schema+"budget_period_group WHERE month < 4 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'OCT', (SELECT Isnull(Round(Sum(m2) / 3, 2), 0) FROM "+schema+"budget_period_group WHERE month < 4 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'NOV', (SELECT Isnull(Round(Sum(m2) / 3, 2), 0) FROM "+schema+"budget_period_group WHERE month < 4 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id = '"+customer+"' GROUP BY product_line";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	/**************************************************** 2 cc *********************************************************/

	get_budget_period_by_year_forecast_2: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2) / 2, 2), 0) FROM "+schema+"budget_period_group WHERE month < 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2) / 2, 2), 0) FROM "+schema+"budget_period_group WHERE month < 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2) / 2, 2), 0) FROM "+schema+"budget_period_group WHERE month < 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2) / 2, 2), 0) FROM "+schema+"budget_period_group WHERE month < 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2) / 2, 2), 0) FROM "+schema+"budget_period_group WHERE month < 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2) / 2, 2), 0) FROM "+schema+"budget_period_group WHERE month < 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2) / 2, 2), 0) FROM "+schema+"budget_period_group WHERE month < 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'SEP', (SELECT Isnull(Round(Sum(m2) / 2, 2), 0) FROM "+schema+"budget_period_group WHERE month < 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'OCT', (SELECT Isnull(Round(Sum(m2) / 2, 2), 0) FROM "+schema+"budget_period_group WHERE month < 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'NOV', (SELECT Isnull(Round(Sum(m2) / 2, 2), 0) FROM "+schema+"budget_period_group WHERE month < 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_by_year_forecast_2_cc: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2) / 2, 2), 0) FROM "+schema+"budget_period_group WHERE month < 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2) / 2, 2), 0) FROM "+schema+"budget_period_group WHERE month < 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2) / 2, 2), 0) FROM "+schema+"budget_period_group WHERE month < 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2) / 2, 2), 0) FROM "+schema+"budget_period_group WHERE month < 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2) / 2, 2), 0) FROM "+schema+"budget_period_group WHERE month < 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2) / 2, 2), 0) FROM "+schema+"budget_period_group WHERE month < 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2) / 2, 2), 0) FROM "+schema+"budget_period_group WHERE month < 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'SEP', (SELECT Isnull(Round(Sum(m2) / 2, 2), 0) FROM "+schema+"budget_period_group WHERE month < 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'OCT', (SELECT Isnull(Round(Sum(m2) / 2, 2), 0) FROM "+schema+"budget_period_group WHERE month < 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'NOV', (SELECT Isnull(Round(Sum(m2) / 2, 2), 0) FROM "+schema+"budget_period_group WHERE month < 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id = '"+customer+"' GROUP BY product_line";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	/**************************************************** 1 cc *********************************************************/

	get_budget_period_by_year_forecast_1: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'SEP', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'OCT', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'NOV', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_by_year_forecast_1_cc: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'SEP', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'OCT', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'NOV', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id = '"+customer+"' GROUP BY product_line";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});	
				
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/***************************************** Termina Configuraciones por meses *********************************************/
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/************************ Configuraciones por meses si ya se guardo mes anterior *****************************************/
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	get_budget_period_last_month_forecast_12: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');
		var forecast = 10;

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'SEP', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 10 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'OCT', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 11 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'NOV', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 12 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line ";
				
				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_last_month_forecast_11: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');
		var forecast = 10;

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'SEP', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 10 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'OCT', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 11 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'NOV', (SELECT DIC FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line";
				
				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_last_month_forecast_10: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');
		var forecast = 9;

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'SEP', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 10 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'OCT', (SELECT NOV FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'NOV', (SELECT DIC FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line";
				
				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_last_month_forecast_9: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');
		var forecast = 8;

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'SEP', (SELECT OCT FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'OCT', (SELECT NOV FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'NOV', (SELECT DIC FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line";
				
				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_last_month_forecast_8: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');
		var forecast = 7;

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'AGO', (SELECT SEP FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'SEP', (SELECT OCT FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'OCT', (SELECT NOV FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'NOV', (SELECT DIC FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line ";
				
				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_last_month_forecast_7: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');
		var forecast = 6;

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUL', (SELECT AGO FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'AGO', (SELECT SEP FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'SEP', (SELECT OCT FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'OCT', (SELECT NOV FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'NOV', (SELECT DIC FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line ";
				
				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});		
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_last_month_forecast_6: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');
		var forecast = 5;

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'JUN', (SELECT JUL FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'JUL', (SELECT AGO FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'AGO', (SELECT SEP FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'SEP', (SELECT OCT FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'OCT', (SELECT NOV FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'NOV', (SELECT DIC FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line";
				
				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_last_month_forecast_5: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');
		var forecast = 4;

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAY', (SELECT JUN FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'JUN', (SELECT JUL FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'JUL', (SELECT AGO FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'AGO', (SELECT SEP FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'SEP', (SELECT OCT FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'OCT', (SELECT NOV FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'NOV', (SELECT DIC FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line";
				
				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_last_month_forecast_4: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');
		var forecast = 3;

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ABR', (SELECT MAY FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'MAY', (SELECT JUN FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'JUN', (SELECT JUL FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'JUL', (SELECT AGO FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'AGO', (SELECT SEP FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'SEP', (SELECT OCT FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'OCT', (SELECT NOV FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'NOV', (SELECT DIC FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line";
				
				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_last_month_forecast_3: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');
		var forecast = 2;

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'MAR', (SELECT ABR FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'ABR', (SELECT MAY FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'MAY', (SELECT JUN FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'JUN', (SELECT JUL FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'JUL', (SELECT AGO FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'AGO', (SELECT SEP FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'SEP', (SELECT OCT FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'OCT', (SELECT NOV FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'NOV', (SELECT DIC FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line";
				
				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_last_month_forecast_2: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');
		var forecast = 1;

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS 'FEB', (SELECT MAR FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'MAR', (SELECT ABR FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'ABR', (SELECT MAY FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'MAY', (SELECT JUN FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'JUN', (SELECT JUL FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'JUL', (SELECT AGO FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'AGO', (SELECT SEP FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'SEP', (SELECT OCT FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'OCT', (SELECT NOV FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'NOV', (SELECT DIC FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND FORECAST = "+forecast+") AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line ";
				
				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});	
				
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},


	//////////////////////////////////// CC //////////////////////////////////////////////

	get_budget_period_last_month_forecast_12_cc: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');
		var forecast = 10;

		try{
			sql.connect(db_config, function (err) {
		        if (err) console.log(err);
		        con = new sql.Request();
					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'SEP', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 10 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'OCT', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 11 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'NOV', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 12 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id = '"+customer+"' GROUP BY product_line";
				

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_last_month_forecast_11_cc: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');
		var forecast = 10;

		try{
			sql.connect(db_config, function (err) {
		        if (err) console.log(err);
		        con = new sql.Request();
					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'SEP', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 10 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'OCT', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 11 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'NOV', (SELECT DIC FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id = '"+customer+"' GROUP BY product_line";
				

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_last_month_forecast_10_cc: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');
		var forecast = 9;

		try{
			sql.connect(db_config, function (err) {
		        if (err) console.log(err);
		        con = new sql.Request();
					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'SEP', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 10 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'OCT', (SELECT NOV FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'NOV', (SELECT DIC FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id = '"+customer+"' GROUP BY product_line ";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_last_month_forecast_9_cc: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');
		var forecast = 8;

		try{
			sql.connect(db_config, function (err) {
		        if (err) console.log(err);
		        con = new sql.Request();
					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'AGO', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'SEP', (SELECT OCT FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'OCT', (SELECT NOV FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'NOV', (SELECT DIC FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id = '"+customer+"' GROUP BY product_line ";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_last_month_forecast_8_cc: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');
		var forecast = 7;

		try{
			sql.connect(db_config, function (err) {
		        if (err) console.log(err);
		        con = new sql.Request();
					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUL', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'AGO', (SELECT SEP FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'SEP', (SELECT OCT FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'OCT', (SELECT NOV FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'NOV', (SELECT DIC FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id = '"+customer+"' GROUP BY product_line ";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_last_month_forecast_7_cc: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');
		var forecast = 6;

		try{
			sql.connect(db_config, function (err) {
		        if (err) console.log(err);
		        con = new sql.Request();
					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUN', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUL', (SELECT AGO FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'AGO', (SELECT SEP FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'SEP', (SELECT OCT FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'OCT', (SELECT NOV FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'NOV', (SELECT DIC FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id = '"+customer+"' GROUP BY product_line ";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_last_month_forecast_6_cc: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');
		var forecast = 5;

		try{
			sql.connect(db_config, function (err) {
		        if (err) console.log(err);
		        con = new sql.Request();
					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAY', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUN', (SELECT JUL FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'JUL', (SELECT AGO FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'AGO', (SELECT SEP FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'SEP', (SELECT OCT FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'OCT', (SELECT NOV FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'NOV', (SELECT DIC FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id = '"+customer+"' GROUP BY product_line ";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_last_month_forecast_5_cc: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');
		var forecast = 4;

		try{
			sql.connect(db_config, function (err) {
		        if (err) console.log(err);
		        con = new sql.Request();
					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ABR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAY', (SELECT JUN FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'JUN', (SELECT JUL FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'JUL', (SELECT AGO FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'AGO', (SELECT SEP FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'SEP', (SELECT OCT FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'OCT', (SELECT NOV FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'NOV', (SELECT DIC FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id = '"+customer+"' GROUP BY product_line ";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_last_month_forecast_4_cc: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');
		var forecast = 3;

		try{
			sql.connect(db_config, function (err) {
		        if (err) console.log(err);
		        con = new sql.Request();
					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAR', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ABR', (SELECT MAY FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'MAY', (SELECT JUN FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'JUN', (SELECT JUL FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'JUL', (SELECT AGO FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'AGO', (SELECT SEP FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'SEP', (SELECT OCT FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'OCT', (SELECT NOV FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'NOV', (SELECT DIC FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id = '"+customer+"' GROUP BY product_line ";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_last_month_forecast_3_cc: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');
		var forecast = 2;

		try{
			sql.connect(db_config, function (err) {
		        if (err) console.log(err);
		        con = new sql.Request();
					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'FEB', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAR', (SELECT ABR FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'ABR', (SELECT MAY FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'MAY', (SELECT JUN FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'JUN', (SELECT JUL FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'JUL', (SELECT AGO FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'AGO', (SELECT SEP FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'SEP', (SELECT OCT FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'OCT', (SELECT NOV FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'NOV', (SELECT DIC FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id = '"+customer+"' GROUP BY product_line ";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_last_month_forecast_2_cc: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');
		var forecast = 1;

		try{
			sql.connect(db_config, function (err) {
		        if (err) console.log(err);
		        con = new sql.Request();
					
				const query = "SELECT product_line AS 'PRODUCTO',(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ENE', (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'FEB', (SELECT MAR FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'MAR', (SELECT ABR FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'ABR', (SELECT MAY FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'MAY', (SELECT JUN FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'JUN', (SELECT JUL FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'JUL', (SELECT AGO FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'AGO', (SELECT SEP FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'SEP', (SELECT OCT FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'OCT', (SELECT NOV FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'NOV', (SELECT DIC FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"' AND forecast = "+forecast+") AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id = '"+customer+"' GROUP BY product_line ";

				
				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	


	/////////////////////////////////////////*** Termina ***///////////////////////////////////////////////////////////////////
	/************************ Configuraciones por meses si ya se guardo mes anterior *****************************************/
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	get_cuentas_clave: function(req, res){

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();
				const query = "SELECT * FROM "+schema+"customers WHERE customer_type_id = 2";

				con.query(query, (err, result, fields) => {
				    if (err) throw err;

				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	check_cuentas_clave: function(req, res){

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();
				const query = "SELECT Count(DISTINCT( c.customer_id)) AS ccbnyp,(SELECT Count(DISTINCT( customer_id )) FROM "+schema+"customers WHERE customer_type_id = 2) AS cc FROM "+schema+"customers c INNER JOIN "+schema+"budget_next_year_cc bnyp ON c.customer_id = bnyp.customer_id WHERE customer_type_id = 2;";

				con.query(query, (err, result, fields) => {
				    if (err) throw err;

				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},



	get_budget_period_by_year_1_cc: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

				if (customer === 'ALL') {
					const query = "";
				}else{
					if (commercial_zone != 'CCVE') {
						const query = "SELECT product_line AS 'PRODUCTO',(SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer+"') AS 'ENE', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer+"') AS 'FEB', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer+"') AS 'MAR', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer+"') AS 'ABR', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer+"') AS 'MAY', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer+"') AS 'JUN', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer+"') AS 'JUL', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer+"') AS 'AGO', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer+"') AS 'SEP', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 10 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer+"') AS 'OCT', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 11 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer+"') AS 'NOV', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 12 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer+"') AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id = '"+customer+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line";

						con.query(query, (err, result, fields) => {
						    // if any error while executing above query, throw error
						    if (err) throw err;

						    // if there is no error, you have the result
						    //console.log(result);
						    res.setHeader('Content-Type', 'application/json');
							res.end(JSON.stringify(result.recordset));
						});
					}else {
						const query = "SELECT product_line AS 'PRODUCTO',(SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ENE', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'FEB', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAR', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'ABR', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'MAY', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUN', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'JUL', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'AGO', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'SEP', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 10 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'OCT', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 11 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'NOV', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 12 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id = '"+customer+"' GROUP BY product_line";

						con.query(query, (err, result, fields) => {
						    // if any error while executing above query, throw error
						    if (err) throw err;

						    // if there is no error, you have the result
						    //console.log(result);
						    res.setHeader('Content-Type', 'application/json');
							res.end(JSON.stringify(result.recordset));
						});
					}
						
				}
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_by_year_1_all_cc: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var customer = req.param('customer');
		var commercial_zone = req.param('commercial_zone');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

				if (commercial_zone != 'CCVE') {
					const query = "SELECT product_line AS 'PRODUCTO',(SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id IN ( "+customer+")) AS 'ENE', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id IN ( "+customer+" )) AS 'FEB', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id IN ( "+customer+" )) AS 'MAR', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id IN ( "+customer+" )) AS 'ABR', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id IN ( "+customer+" )) AS 'MAY', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id IN ( "+customer+" )) AS 'JUN', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id IN ( "+customer+" )) AS 'JUL', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id IN ( "+customer+" )) AS 'AGO', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id IN ( "+customer+" )) AS 'SEP', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 10 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id IN ( "+customer+" )) AS 'OCT', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 11 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id IN ( "+customer+" )) AS 'NOV', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 12 AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id IN ( "+customer+" )) AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id IN ( "+customer+" ) AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line";
					con.query(query, (err, result, fields) => {
					    // if any error while executing above query, throw error
					    if (err) throw err;

					    // if there is no error, you have the result
					    //console.log(result);
					    res.setHeader('Content-Type', 'application/json');
						res.end(JSON.stringify(result.recordset));
					});
				}else{
					const query = "SELECT product_line AS 'PRODUCTO',(SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) AS 'ENE', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) AS 'FEB', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) AS 'MAR', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) AS 'ABR', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) AS 'MAY', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) AS 'JUN', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) AS 'JUL', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) AS 'AGO', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) AS 'SEP', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 10 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) AS 'OCT', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 11 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) AS 'NOV', (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE month = 12 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) AS 'DIC' FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id IN ("+customer+") GROUP BY product_line";
					con.query(query, (err, result, fields) => {
					    // if any error while executing above query, throw error
					    if (err) throw err;

					    // if there is no error, you have the result
					    //console.log(result);
					    res.setHeader('Content-Type', 'application/json');
						res.end(JSON.stringify(result.recordset));
					});
				}
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_tiendas_nuevas_cc: function(req, res){
		var customer_id = req.param('customer');
		var year = req.param('year');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

				const query = "SELECT tienda FROM "+schema+"budget_next_year_cc WHERE tienda_status = 2 AND customer_id = '"+customer_id+"' AND year = '"+year+"' GROUP BY tienda"
				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	
	/********** Pendiente **********/	
	get_tiendas_cerradas_cc: function(req, res){
		var customer_id = req.param('customer');
		var year = req.param('year');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();
				//const query = "SELECT tienda AS t, month AS mo, product_line as pl,(SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE tienda = t AND month = mo AND year = '"+year+"') AS met, (SELECT Count(*) total FROM "+schema+"budget_next_year_cc WHERE tienda_status = 1 AND customer_id = '"+customer_id+"' AND month = mo AND year = '"+year+"') AS rep, ( (SELECT met) / (SELECT rep)) AS dv FROM "+schema+"budget_next_year_cc WHERE tienda_status = 0 AND customer_id = '"+customer_id+"' AND year = '"+year+"' GROUP BY dv";
				const query = "SELECT A.tienda AS t, A.month AS mo, MAX(A.product_line) as pl,(SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE year = '2020' AND month = A.month AND tienda = A.tienda) AS met, (SELECT Count(*) total FROM "+schema+"budget_next_year_cc WHERE tienda_status = 1 AND customer_id = '20031115' AND month = A.month AND year = '2020') AS rep, ((SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE year = '2020' AND month = A.month AND tienda = A.tienda)/(SELECT Count(*) total FROM "+schema+"budget_next_year_cc WHERE tienda_status = 1 AND customer_id = '20031115' AND month = A.month AND year = '2020')) as dv FROM "+schema+"budget_next_year_cc A WHERE A.tienda_status = 0 AND A.customer_id = '20031115' AND A.year = '2020' GROUP BY month, tienda";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	accion_ajuste_por_tienda_cerrada_cc: function(req, res){
		var customer_id = req.param('customer');
		var year = req.param('year');
		var tienda = req.param('tienda');
		var mes = req.param('mes');
		var monto = req.param('monto');
		var pl = req.param('pl');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();
				const query = "UPDATE "+schema+"budget_next_year_cc SET annual_growth_m2 =( annual_growth_m2 + '"+monto+"') WHERE customer_id = '"+customer_id+"' AND year = '"+year+"' AND tienda_status = 1 AND product_line = '"+pl+"' AND month = '"+mes+"'";

				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify({status:200}));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}

	},

	get_pl_tiendas_nuevas_cc: function(req, res){

		var tienda = req.param('tienda');
		var year = req.param('year');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

				const query = "SELECT product_line as pl FROM "+schema+"budget_next_year_cc WHERE tienda = '"+tienda+"' AND year = '"+year+"' GROUP BY product_line";
				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_monto_mensual_tiendas_nuevas_cc: function(req, res){
		var tienda = req.param('tienda');
		var year = req.param('year');
		var pl = req.param('pl');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();

				const query = "SELECT (SUM(annual_growth_m2)/12) as monto FROM "+schema+"budget_next_year_cc WHERE tienda = '"+tienda+"' AND year = '"+year+"' AND product_line = '"+pl+"'";
				
				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}

	},

	accion_ajustar_tienda_nueva_cc: function(req, res){
		
		var tienda = req.param('tienda');
		var year = req.param('year');
		var pl = req.param('pl');
		var monto = req.param('monto');
		var month = req.param('month');

		try{
			sql.connect(db_config, function (err) {
	    
		        if (err) console.log(err);

		        con = new sql.Request();
				//const query = "INSERT INTO "+schema+"budget_next_year_cc(year, month, commercial_zone, customer_id, customer, tienda, tienda_desc, tienda_status, seller_number, product_line, last_year_budget, annual_growth_percentage, annual_growth_m2) SELECT '"+year+"', '"+month+"', commercial_zone, customer_id, customer, '"+tienda+"', tienda_desc, tienda_status, seller_number, '"+pl+"', 0, annual_growth_percentage, '"+monto+"' FROM "+schema+"budget_next_year_cc WHERE tienda = "+tienda+" AND year = '"+year+"' AND product_line = '"+pl+"' GROUP BY product_line";
				const query = "INSERT INTO "+schema+"budget_next_year_cc(year, month, commercial_zone, customer_id, customer, tienda, tienda_desc, tienda_status, seller_number, product_line, last_year_budget, annual_growth_percentage, annual_growth_m2) SELECT '"+year+"', '"+month+"', MAX(commercial_zone), MAX(customer_id), MAX(customer), '"+tienda+"', MAX(tienda_desc), MAX(tienda_status), MAX(seller_number), '"+pl+"', 0, MAX(annual_growth_percentage), '"+monto+"' FROM "+schema+"budget_next_year_cc WHERE tienda = '"+tienda+"' AND year = '"+year+"' AND product_line = '"+pl+"' GROUP BY product_line";
				
				con.query(query, (err, result, fields) => {
				    // if any error while executing above query, throw error
				    if (err) throw err;

				    // if there is no error, you have the result
				    //console.log(result);
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify({status:200}));
				});
			});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	delete_post_ajuste_tienda_nueva_cc: function(req, res){
		
		var tienda = req.param('tienda');
		var year = req.param('year');
		var pl = req.param('pl');
		var monto = req.param('monto');

		try{
		sql.connect(db_config, function (err) {
    
	        if (err) console.log(err);

	        con = new sql.Request();
			const query = "DELETE FROM "+schema+"budget_next_year_cc WHERE tienda = '"+tienda+"' AND year = '"+year+"' AND product_line = '"+pl+"' AND annual_growth_m2 != '"+monto+"'";
			con.query(query, (err, result, fields) => {
			    // if any error while executing above query, throw error
			    if (err) throw err;

			    // if there is no error, you have the result
			    //console.log(result);
			    res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify({status:200}));
			});
		});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	delete_post_ajuste_tienda_cerrada_cc: function(req, res){
		
		var tienda = req.param('tienda');
		var year = req.param('year');

		try{
		sql.connect(db_config, function (err) {
    
	        if (err) console.log(err);

	        con = new sql.Request();
			const query = "DELETE FROM "+schema+"budget_next_year_cc WHERE tienda = '"+tienda+"' AND year = '"+year+"'";
			con.query(query, (err, result, fields) => {
			    // if any error while executing above query, throw error
			    if (err) throw err;

			    // if there is no error, you have the result
			    //console.log(result);
			    res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify({status:200}));
			});
		});
		}catch (error) {
			res.status(500).json({error});
		}
	},
	

	get_budget_period_percent_by_year: function(req, res){
		var year = req.param('year');
		var commercial_zone = req.param('commercial_zone');
		var product_line = req.param('product_line');
		//ROUND const query = "SELECT product_line, ISNULL((ROUND((SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")*100)),0) AS ENE, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")*100 )),0) AS FEB, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")*100 )),0) AS MAR, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")*100 )),0) AS ABR, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")*100 )),0) AS MAY, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")*100 )),0) AS JUN, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")*100 )),0) AS JUL, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")*100 )),0) AS AGO, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")*100 )),0) AS SEP, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 10 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")*100 )),0) AS OCT, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 11 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")*100 )),0) AS NOV, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 12 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")*100 )),0) AS DIC FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line";
		
		try{
		sql.connect(db_config, function (err) {
    
	        if (err) console.log(err);

	        con = new sql.Request();
			const query = "SELECT product_line, ISNULL(((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100), 0) AS ENE, ISNULL(( (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100 ), 0) AS FEB, ISNULL(( (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100 ), 0) AS MAR, ISNULL(( (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100 ), 0) AS ABR, ISNULL(( (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100 ), 0) AS MAY, ISNULL(( (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100 ), 0) AS JUN, ISNULL(( (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100 ), 0) AS JUL, ISNULL(( (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100 ), 0) AS AGO, ISNULL(( (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100 ), 0) AS SEP, ISNULL(( (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 10 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100 ), 0) AS OCT, ISNULL(( (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 11 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100 ), 0) AS NOV, ISNULL(( (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 12 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100 ), 0) AS DIC FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line ";

			con.query(query, (err, result, fields) => {
			    // if any error while executing above query, throw error
			    if (err) throw err;

			    // if there is no error, you have the result
			    //console.log(result);
			    res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(result.recordset));
			});
		});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_percent_by_year: function(req, res){
		var year = req.param('year');
		var commercial_zone = req.param('commercial_zone');
		var product_line = req.param('product_line');
		//ROUND const query = "SELECT product_line, ISNULL((ROUND((SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")*100)),0) AS ENE, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")*100 )),0) AS FEB, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")*100 )),0) AS MAR, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")*100 )),0) AS ABR, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")*100 )),0) AS MAY, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")*100 )),0) AS JUN, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")*100 )),0) AS JUL, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")*100 )),0) AS AGO, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")*100 )),0) AS SEP, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 10 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")*100 )),0) AS OCT, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 11 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")*100 )),0) AS NOV, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 12 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")*100 )),0) AS DIC FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line";
		
		try{
		sql.connect(db_config, function (err) {
    
	        if (err) console.log(err);

	        con = new sql.Request();
			const query = "SELECT product_line, ISNULL(((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100), 0) AS ENE, ISNULL(( (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100 ), 0) AS FEB, ISNULL(( (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100 ), 0) AS MAR, ISNULL(( (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100 ), 0) AS ABR, ISNULL(( (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100 ), 0) AS MAY, ISNULL(( (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100 ), 0) AS JUN, ISNULL(( (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100 ), 0) AS JUL, ISNULL(( (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100 ), 0) AS AGO, ISNULL(( (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100 ), 0) AS SEP, ISNULL(( (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 10 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100 ), 0) AS OCT, ISNULL(( (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 11 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100 ), 0) AS NOV, ISNULL(( (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 12 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100 ), 0) AS DIC FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line ";

			con.query(query, (err, result, fields) => {
			    // if any error while executing above query, throw error
			    if (err) throw err;

			    // if there is no error, you have the result
			    //console.log(result);
			    res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(result.recordset));
			});
		});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_percent_by_year_cc: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');

		try{
		sql.connect(db_config, function (err) {
    
	        if (err) console.log(err);

	        con = new sql.Request();
			const query = "SELECT product_line, ISNULL((ROUND((SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"')/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"')*100)),0) AS ENE, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"')/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"')*100 )),0) AS FEB, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"')/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"')*100 )),0) AS MAR, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"')/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"')*100 )),0) AS ABR, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"')/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"')*100 )),0) AS MAY, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"')/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"')*100 )),0) AS JUN, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"')/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"')*100 )),0) AS JUL, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"')/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"')*100 )),0) AS AGO, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"')/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"')*100 )),0) AS SEP, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 10 AND product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"')/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"')*100 )),0) AS OCT, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 11 AND product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"')/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"')*100 )),0) AS NOV, ISNULL((ROUND( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 12 AND product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"')/ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"')*100 )),0) AS DIC FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer = '"+customer+"' GROUP BY product_line";

			con.query(query, (err, result, fields) => {
			    // if any error while executing above query, throw error
			    if (err) throw err;

			    // if there is no error, you have the result
			    //console.log(result);
			    res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(result.recordset));
			});
		});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_percent_by_year_all_cc: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');

		try{
		sql.connect(db_config, function (err) {
    
	        if (err) console.log(err);

	        con = new sql.Request();
			const query = "SELECT product_line, ISNULL(( Round((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN("+customer+")) / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) * 100)), 0) AS ENE, ISNULL(( Round((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) * 100) ), 0) AS FEB, ISNULL(( Round((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) * 100) ), 0) AS MAR, ISNULL(( Round((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) * 100) ), 0) AS ABR, ISNULL(( Round((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) * 100) ), 0) AS MAY, ISNULL(( Round((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) * 100) ), 0) AS JUN, ISNULL(( Round((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) * 100) ), 0) AS JUL, ISNULL(( Round((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) * 100) ), 0) AS AGO, ISNULL(( Round((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) * 100) ), 0) AS SEP, ISNULL(( Round((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 10 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) * 100) ), 0) AS OCT, ISNULL(( Round((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 11 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) * 100) ), 0) AS NOV, ISNULL(( Round((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 12 AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id IN ("+customer+")) * 100) ), 0) AS DIC FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id IN ("+customer+") GROUP BY product_line ";

			con.query(query, (err, result, fields) => {
			    // if any error while executing above query, throw error
			    if (err) throw err;

			    // if there is no error, you have the result
			    //console.log(result);
			    res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(result.recordset));
			});
		});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_percents_p1_cc: function(req, res){
		var year = req.param('year');
		var customer = req.param('customer');
		var product_line = req.param('product_line');

		try{
		sql.connect(db_config, function (err) {
    
	        if (err) console.log(err);

	        con = new sql.Request();
			const query = "SET ARITHABORT OFF SET ANSI_WARNINGS OFF SELECT product_line AS 'product_line', Round(((SELECT ene FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') / (SELECT( tot) FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') ) * 100, 2) AS 'ENE', Round(( (SELECT feb FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') / (SELECT ( tot ) FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') ) * 100, 2) AS 'FEB', Round(( (SELECT mar FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') / (SELECT ( tot ) FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') ) * 100, 2) AS 'MAR', Round(( (SELECT abr FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') / (SELECT ( tot ) FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') ) * 100, 2) AS 'ABR', Round(( (SELECT may FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') / (SELECT ( tot ) FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') ) * 100, 2) AS 'MAY', Round(( (SELECT jun FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') / (SELECT ( tot ) FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') ) * 100, 2) AS 'JUN', Round(( (SELECT jul FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') / (SELECT ( tot ) FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') ) * 100, 2) AS 'JUL', Round(( (SELECT ago FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') / (SELECT ( tot ) FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') ) * 100, 2) AS 'AGO', Round(( (SELECT sep FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') / (SELECT ( tot ) FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') ) * 100, 2) AS 'SEP', Round(( (SELECT oct FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') / (SELECT ( tot ) FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') ) * 100, 2) AS 'OCT', Round(( (SELECT nov FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') / (SELECT ( tot ) FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') ) * 100, 2) AS 'NOV', Round(( (SELECT dic FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') / (SELECT ( tot ) FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') ) * 100, 2) AS 'DIC' FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"'";

			con.query(query, (err, result, fields) => {
			    // if any error while executing above query, throw error
			    if (err) throw err;

			    // if there is no error, you have the result
			    //console.log(result);
			    res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(result.recordset));
			});
		});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_percents_forecast_p1_cc: function(req, res){
		var year = req.param('year');
		var customer = req.param('customer');
		var product_line = req.param('product_line');
		var forecast = req.param('forecast');

		try{
		sql.connect(db_config, function (err) {
    
	        if (err) console.log(err);

	        con = new sql.Request();
			const query = "SET arithabort OFF SET ansi_warnings OFF SELECT PRODUCT_LINE AS 'product_line', Round(((SELECT ENE FROM "+schema+"forecast_con_cc WHERE year = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") / (SELECT( TOT) FROM "+schema+"forecast_con_cc WHERE year = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") ) * 100, 2) AS 'ENE', Round(( (SELECT FEB FROM "+schema+"forecast_con_cc WHERE year = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") / (SELECT ( TOT ) FROM "+schema+"forecast_con_cc WHERE year = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") ) * 100, 2) AS 'FEB', Round(( (SELECT MAR FROM "+schema+"forecast_con_cc WHERE year = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") / (SELECT ( TOT ) FROM "+schema+"forecast_con_cc WHERE year = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") ) * 100, 2) AS 'MAR', Round(( (SELECT ABR FROM "+schema+"forecast_con_cc WHERE year = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") / (SELECT ( TOT ) FROM "+schema+"forecast_con_cc WHERE year = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") ) * 100, 2) AS 'ABR', Round(( (SELECT MAY FROM "+schema+"forecast_con_cc WHERE year = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") / (SELECT ( TOT ) FROM "+schema+"forecast_con_cc WHERE year = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") ) * 100, 2) AS 'MAY', Round(( (SELECT JUN FROM "+schema+"forecast_con_cc WHERE year = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") / (SELECT ( TOT ) FROM "+schema+"forecast_con_cc WHERE year = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") ) * 100, 2) AS 'JUN', Round(( (SELECT JUL FROM "+schema+"forecast_con_cc WHERE year = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") / (SELECT ( TOT ) FROM "+schema+"forecast_con_cc WHERE year = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") ) * 100, 2) AS 'JUL', Round(( (SELECT AGO FROM "+schema+"forecast_con_cc WHERE year = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") / (SELECT ( TOT ) FROM "+schema+"forecast_con_cc WHERE year = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") ) * 100, 2) AS 'AGO', Round(( (SELECT SEP FROM "+schema+"forecast_con_cc WHERE year = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") / (SELECT ( TOT ) FROM "+schema+"forecast_con_cc WHERE year = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") ) * 100, 2) AS 'SEP', Round(( (SELECT OCT FROM "+schema+"forecast_con_cc WHERE year = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") / (SELECT ( TOT ) FROM "+schema+"forecast_con_cc WHERE year = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") ) * 100, 2) AS 'OCT', Round(( (SELECT NOV FROM "+schema+"forecast_con_cc WHERE year = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") / (SELECT ( TOT ) FROM "+schema+"forecast_con_cc WHERE year = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") ) * 100, 2) AS 'NOV', Round(( (SELECT DIC FROM "+schema+"forecast_con_cc WHERE year = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") / (SELECT ( TOT ) FROM "+schema+"forecast_con_cc WHERE year = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") ) * 100, 2) AS 'DIC' FROM "+schema+"forecast_con_cc WHERE year = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast;

			
			con.query(query, (err, result, fields) => {
			    // if any error while executing above query, throw error
			    if (err) throw err;

			    // if there is no error, you have the result
			    //console.log(result);
			    res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(result.recordset));
			});
		});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_percents_forecast_p1: function(req, res){
		var year = req.param('year');
		var commercial_zone = req.param('commercial_zone');
		var product_line = req.param('product_line');
		var forecast = req.param('forecast');

		try{
		sql.connect(db_config, function (err) {
    
	        if (err) console.log(err);

	        con = new sql.Request();
			const query = "SET arithabort OFF SET ansi_warnings OFF SELECT product_line AS 'product_line', Isnull(Round(((SELECT ene FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") / (SELECT TOT FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+")) * 100 , 2), 0) AS 'ENE', Isnull(Round(( (SELECT feb FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") / (SELECT TOT FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") ) * 100 , 2), 0) AS 'FEB', Isnull(Round(( (SELECT mar FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") / (SELECT TOT FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") ) * 100 , 2), 0) AS 'MAR', Isnull(Round(( (SELECT abr FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") / (SELECT TOT FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") ) * 100 , 2), 0) AS 'ABR', Isnull(Round(( (SELECT may FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") / (SELECT TOT FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") ) * 100 , 2), 0) AS 'MAY', Isnull(Round(( (SELECT jun FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") / (SELECT TOT FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") ) * 100 , 2), 0) AS 'JUN', Isnull(Round(( (SELECT jul FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") / (SELECT TOT FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") ) * 100 , 2), 0) AS 'JUL', Isnull(Round(( (SELECT ago FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") / (SELECT TOT FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") ) * 100 , 2), 0) AS 'AGO', Isnull(Round(( (SELECT sep FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") / (SELECT TOT FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") ) * 100 , 2), 0) AS 'SEP', Isnull(Round(( (SELECT oct FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") / (SELECT TOT FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") ) * 100 , 2), 0) AS 'OCT', Isnull(Round(( (SELECT nov FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") / (SELECT TOT FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") ) * 100 , 2), 0) AS 'NOV', Isnull(Round(( (SELECT dic FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") / (SELECT TOT FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") ) * 100 , 2), 0) AS 'DIC' FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast;
			

			
			con.query(query, (err, result, fields) => {
			    // if any error while executing above query, throw error
			    if (err) throw err;

			    // if there is no error, you have the result
			    //console.log(result);
			    res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(result.recordset));
			});
		});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_percent_last_three_year: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');

		try{
		sql.connect(db_config, function (err) {
    
	        if (err) console.log(err);

	        con = new sql.Request();
			const query = "SELECT PRODUCTO, ISNULL((ROUND(ENE/TOT*100)),0) AS ENE, ISNULL((ROUND(FEB/TOT*100)),0) AS FEB, ISNULL((ROUND(MAR/TOT*100)),0) AS MAR, ISNULL((ROUND(ABR/TOT*100)),0) AS ABR, ISNULL((ROUND(MAY/TOT*100)),0) AS MAY, ISNULL((ROUND(JUN/TOT*100)),0) AS JUN, ISNULL((ROUND(JUL/TOT*100)),0) AS JUL, ISNULL((ROUND(AGO/TOT*100)),0) AS AGO, ISNULL((ROUND(SEP/TOT*100)),0) AS SEP, ISNULL((ROUND(OCT/TOT*100)),0) AS OCT, ISNULL((ROUND(NOV/TOT*100)),0) AS NOV, ISNULL((ROUND(DIC/TOT*100)),0) AS DIC FROM "+schema+"forecast_sub_years WHERE YEAR = "+year+" AND PRODUCTO = '"+product_line+"'";

			con.query(query, (err, result, fields) => {
			    // if any error while executing above query, throw error
			    if (err) throw err;

			    // if there is no error, you have the result
			    //console.log(result);
			    res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(result.recordset));
			});
		});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_budget_period_q: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var commercial_zone = req.param('commercial_zone');

		try{
		sql.connect(db_config, function (err) {
    
	        if (err) console.log(err);

	        con = new sql.Request();
			//const query = "SELECT product_line, ISNULL((ROUND(((SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")+ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")+ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")) /(SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")* 100)),0) AS Q1, ISNULL((ROUND(( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")+ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")+ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+") ) /(SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")* 100)),0) AS Q2, ISNULL((ROUND(( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")+ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")+ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+") ) /(SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")* 100)),0) AS Q3, ISNULL((ROUND(( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 10 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")+ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 11 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")+ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 12 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+") ) /(SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+")* 100)),0) AS Q4 FROM "+schema+"budget_period_group WHERE YEAR = "+year+" AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' GROUP BY product_line";
			const query = "SELECT product_line, ISNULL(( Round(( ISNULL((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+"),0) + ISNULL((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+"),0) + ISNULL((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+"),0)) /(SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100,0) ), 0) AS Q1, ISNULL(( Round(( ISNULL((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+"),0) + ISNULL((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+"),0) + ISNULL((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+"),0) ) / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100,0) ), 0) AS Q2, ISNULL(( Round(( ISNULL((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+"),0) + ISNULL((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+"),0) + ISNULL((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+"),0) ) / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100,0) ), 0) AS Q3, ISNULL(( Round(( ISNULL((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 10 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+"),0) + ISNULL((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 11 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+"),0) + ISNULL((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 12 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+"),0) ) / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100,0) ), 0) AS Q4 FROM "+schema+"budget_period_group WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line ";
			//const query = "SELECT product_line, ISNULL((( ISNULL((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+"),0) + ISNULL((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+"),0) + ISNULL((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+"),0)) / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100) ), 0) AS Q1, ISNULL(( ( ISNULL((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+"),0) + ISNULL((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+"),0) + ISNULL((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+"),0) ) / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100) ), 0) AS Q2, ISNULL(( ( ISNULL((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+"),0) + ISNULL((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+"),0) + ISNULL((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+"),0) ) / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100) ), 0) AS Q3, ISNULL(( ( ISNULL((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 10 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+"),0) + ISNULL((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 11 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+"),0) + ISNULL((SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE month = 12 AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+"),0) ) / (SELECT Sum(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year+") * 100) ), 0) AS Q4 FROM "+schema+"budget_period_group WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line ";
			// make to connection to the database.

			  con.query(query, (err, result, fields) => {
			    // if any error while executing above query, throw error
			    if (err) throw err;
			    
			    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));

			});
		});
		}catch (error) {
			res.status(500).json({error});
		}
	},

	get_forecast_q: function(req, res){
		var year = req.param('year');
		var product_line = req.param('product_line');
		var commercial_zone = req.param('commercial_zone');
		var forecast = req.param('forecast');

		try{
			sql.connect(db_config, function (err) {
    
	        if (err) console.log(err);

	        con = new sql.Request();
			const query = "SET arithabort OFF SET ansi_warnings OFF SELECT product_line AS 'product_line',( ( Round(( (SELECT ene FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") / (SELECT tot FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+")) * 100, 2) ) + ( Round (( (SELECT feb FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") / (SELECT tot FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") ) * 100 , 2) ) + ( Round(( (SELECT mar FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") / ( SELECT tot FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") ) * 100, 2) ) ) AS 'Q1', ( ( Round(( (SELECT abr FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") / (SELECT tot FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") ) * 100, 2) ) + ( Round (( (SELECT may FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") / (SELECT tot FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") ) * 100 , 2) ) + ( Round(( (SELECT jun FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") / ( SELECT tot FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") ) * 100, 2) ) ) AS 'Q2', ( ( Round(( (SELECT jul FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") / (SELECT tot FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") ) * 100, 2) ) + ( Round (( (SELECT ago FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") / (SELECT tot FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") ) * 100 , 2) ) + ( Round(( (SELECT sep FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") / ( SELECT tot FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") ) * 100, 2) ) ) AS 'Q3', ( ( Round(( (SELECT oct FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") / (SELECT tot FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") ) * 100, 2) ) + ( Round (( (SELECT nov FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") / (SELECT tot FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") ) * 100 , 2) ) + ( Round(( (SELECT dic FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") / ( SELECT tot FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") ) * 100, 2) ) ) AS 'Q4' FROM "+schema+"forecast_con WHERE year = "+year+" AND product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast;
			  con.query(query, (err, result, fields) => {
			    // if any error while executing above query, throw error
			    if (err) throw err;
			    
			    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(result.recordset));

			});
		});
		}catch (error) {
			res.status(500).json({error});
		}
	},

  get_budget_period_q_cc: function(req, res){
  	var year = req.param('year');
  	var product_line = req.param('product_line');
  	var commercial_zone = req.param('commercial_zone');

  	try{
  		sql.connect(db_config, function (err) {
    
		    if (err) console.log(err);

		    con = new sql.Request();
		    const query = "SELECT product_line, ISNULL((ROUND(((SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 1 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+" AND customer = '"+customer+"')+ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 2 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+" AND customer = '"+customer+"' )+ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 3 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+" AND customer = '"+customer+"' ) ) /(SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+" AND customer = '"+customer+"' )* 100)),0) AS Q1, ISNULL((ROUND(( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 4 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+" AND customer = '"+customer+"' )+ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 5 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+" AND customer = '"+customer+"' )+ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 6 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+" AND customer = '"+customer+"' ) ) /(SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+" AND customer = '"+customer+"' )* 100)),0) AS Q2, ISNULL((ROUND(( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 7 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+" AND customer = '"+customer+"')+ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 8 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+" AND customer = '"+customer+"')+ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 9 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+" AND customer = '"+customer+"') ) /(SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+" AND customer = '"+customer+"')* 100)),0) AS Q3, ISNULL((ROUND(( (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 10 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+" AND customer = '"+customer+"')+ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 11 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+" AND customer = '"+customer+"')+ (SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE month = 12 AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+" AND customer = '"+customer+"') ) /(SELECT SUM(m2) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND year = "+year+" AND customer = '"+customer+"')* 100)),0) AS Q4 FROM "+schema+"budget_period_group WHERE YEAR = "+year+" AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"' AND customer = '"+customer+"' GROUP BY product_line";
			// make to connection to the database.
			
			con.query(query, (err, result, fields) => {
			    // if any error while executing above query, throw error
			    if (err) throw err;
			    
			    res.setHeader('Content-Type', 'application/json');
		   		res.end(JSON.stringify(result.recordset));

			});
		});
  	}catch (error) {
			res.status(500).json({error});
		}
  },

  get_budget_period_qp1_cc: function(req, res){
  	var year = req.param('year');
  	var product_line = req.param('product_line');
  	var customer = req.param('customer');

  	try{
  		sql.connect(db_config, function (err) {
    
		 	if (err) console.log(err);

		    con = new sql.Request();
		    const query = "SET ARITHABORT OFF SET ANSI_WARNINGS OFF SELECT product_line AS 'product_line',( ( Round(( (SELECT ene FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') / (SELECT ( tot) FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') ) * 100, 2) ) + ( Round( ( (SELECT feb FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') / (SELECT ( tot ) FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') ) * 100, 2) ) + ( Round( ( (SELECT mar FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') / (SELECT ( tot ) FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') ) * 100, 2) ) ) AS 'Q1', ( ( Round(( (SELECT abr FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') / (SELECT ( tot ) FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') ) * 100, 2) ) + ( Round( ( (SELECT may FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') / (SELECT ( tot ) FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') ) * 100, 2) ) + ( Round( ( (SELECT jun FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') / (SELECT ( tot ) FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') ) * 100, 2) ) ) AS 'Q2', ( ( Round(( (SELECT jul FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') / (SELECT ( tot ) FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') ) * 100, 2) ) + ( Round( ( (SELECT ago FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') / (SELECT ( tot ) FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') ) * 100, 2) ) + ( Round( ( (SELECT sep FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') / (SELECT ( tot ) FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') ) * 100, 2) ) ) AS 'Q3', ( ( Round(( (SELECT oct FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') / (SELECT ( tot ) FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') ) * 100, 2) ) + ( Round( ( (SELECT nov FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') / (SELECT ( tot ) FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') ) * 100, 2) ) + ( Round( ( (SELECT dic FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') / (SELECT ( tot ) FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"') ) * 100, 2) ) ) AS 'Q4' FROM "+schema+"budget_period_con_cc WHERE year = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"'";
			// make to connection to the database.
			
		  	con.query(query, (err, result, fields) => {
			    // if any error while executing above query, throw error
			    if (err) throw err;
			    
			    res.setHeader('Content-Type', 'application/json');
		   		res.end(JSON.stringify(result.recordset));

			});
		});
	}catch (error) {
			res.status(500).json({error});
		}
  },

  get_forecast_qp1_cc: function(req, res){
  	var year = req.param('year');
  	var product_line = req.param('product_line');
  	var customer = req.param('customer');
  	var forecast = req.param('forecast');

  	try{
  		sql.connect(db_config, function (err) {
    
		    if (err) console.log(err);

		    con = new sql.Request();
		    const query = "SET arithabort OFF SET ansi_warnings OFF SELECT product_line AS 'product_line',( ( Round(( (SELECT ene FROM "+schema+"forecast_con_cc WHERE YEAR = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") / (SELECT TOT FROM "+schema+"forecast_con_cc WHERE YEAR = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+")) * 100, 2) ) + ( Round ( ( (SELECT feb FROM "+schema+"forecast_con_cc WHERE YEAR = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") / (SELECT TOT FROM "+schema+"forecast_con_cc WHERE YEAR = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") ) * 100, 2) ) + ( Round(( (SELECT mar FROM "+schema+"forecast_con_cc WHERE YEAR = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") / (SELECT TOT FROM "+schema+"forecast_con_cc WHERE YEAR = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") ) * 100, 2) ) ) AS 'Q1', ( ( Round(( (SELECT abr FROM "+schema+"forecast_con_cc WHERE YEAR = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") / (SELECT TOT FROM "+schema+"forecast_con_cc WHERE YEAR = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") ) * 100, 2) ) + ( Round ( ( (SELECT may FROM "+schema+"forecast_con_cc WHERE YEAR = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") / (SELECT TOT FROM "+schema+"forecast_con_cc WHERE YEAR = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") ) * 100, 2) ) + ( Round(( (SELECT jun FROM "+schema+"forecast_con_cc WHERE YEAR = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") / (SELECT TOT FROM "+schema+"forecast_con_cc WHERE YEAR = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") ) * 100, 2) ) ) AS 'Q2', ( ( Round(( (SELECT jul FROM "+schema+"forecast_con_cc WHERE YEAR = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") / (SELECT TOT FROM "+schema+"forecast_con_cc WHERE YEAR = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") ) * 100, 2) ) + ( Round ( ( (SELECT ago FROM "+schema+"forecast_con_cc WHERE YEAR = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") / (SELECT TOT FROM "+schema+"forecast_con_cc WHERE YEAR = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") ) * 100, 2) ) + ( Round(( (SELECT sep FROM "+schema+"forecast_con_cc WHERE YEAR = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") / (SELECT TOT FROM "+schema+"forecast_con_cc WHERE YEAR = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") ) * 100, 2) ) ) AS 'Q3', ( ( Round(( (SELECT oct FROM "+schema+"forecast_con_cc WHERE YEAR = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") / (SELECT TOT FROM "+schema+"forecast_con_cc WHERE YEAR = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") ) * 100, 2) ) + ( Round ( ( (SELECT nov FROM "+schema+"forecast_con_cc WHERE YEAR = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") / (SELECT TOT FROM "+schema+"forecast_con_cc WHERE YEAR = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") ) * 100, 2) ) + ( Round(( (SELECT dic FROM "+schema+"forecast_con_cc WHERE YEAR = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") / (SELECT TOT FROM "+schema+"forecast_con_cc WHERE YEAR = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast+") ) * 100, 2) ) ) AS 'Q4' FROM "+schema+"forecast_con_cc WHERE YEAR = "+year+" AND PRODUCT_LINE = '"+product_line+"' AND customer_id = '"+customer+"' AND FORECAST = "+forecast;
			// make to connection to the database.
			
			  con.query(query, (err, result, fields) => {
			    // if any error while executing above query, throw error
			    if (err) throw err;
			    
			    res.setHeader('Content-Type', 'application/json');
		   		res.end(JSON.stringify(result.recordset));

			});
		});	
	}catch (error) {
			res.status(500).json({error});
		}
  },

  get_trimestral_budget_period_cc: function(req, res){
  	var year = req.param('year');
  	var product_line = req.param('product_line');
  	var customer = req.param('customer');

  	try{
  		sql.connect(db_config, function (err) {
    
		    if (err) console.log(err);

		    con = new sql.Request();
		    const query = "SELECT product_line,((SELECT ene FROM "+schema+"apportionment_period_cc WHERE customer_id = '"+customer+"' AND product_line = '"+product_line+"' AND year = "+year+") + (SELECT feb FROM "+schema+"apportionment_period_cc WHERE customer_id = '"+customer+"' AND product_line = '"+product_line+"' AND year = "+year+") + (SELECT mar FROM "+schema+"apportionment_period_cc WHERE customer_id = '"+customer+"' AND product_line = '"+product_line+"' AND year = "+year+")) AS Q1, ((SELECT abr FROM "+schema+"apportionment_period_cc WHERE customer_id = '"+customer+"' AND product_line = '"+product_line+"' AND year = "+year+") + (SELECT may FROM "+schema+"apportionment_period_cc WHERE customer_id = '"+customer+"' AND product_line = '"+product_line+"' AND year = "+year+") + (SELECT jun FROM "+schema+"apportionment_period_cc WHERE customer_id = '"+customer+"' AND product_line = '"+product_line+"' AND year = "+year+")) AS Q2, ((SELECT jul FROM "+schema+"apportionment_period_cc WHERE customer_id = '"+customer+"' AND product_line = '"+product_line+"' AND year = "+year+") + (SELECT ago FROM "+schema+"apportionment_period_cc WHERE customer_id = '"+customer+"' AND product_line = '"+product_line+"' AND year = "+year+") + (SELECT sep FROM "+schema+"apportionment_period_cc WHERE customer_id = '"+customer+"' AND product_line = '"+product_line+"' AND year = "+year+")) AS Q3, ((SELECT oct FROM "+schema+"apportionment_period_cc WHERE customer_id = '"+customer+"' AND product_line = '"+product_line+"' AND year = "+year+") + (SELECT nov FROM "+schema+"apportionment_period_cc WHERE customer_id = '"+customer+"' AND product_line = '"+product_line+"' AND year = "+year+") + (SELECT dic FROM "+schema+"apportionment_period_cc WHERE customer_id = '"+customer+"' AND product_line = '"+product_line+"' AND year = "+year+")) AS Q4 FROM "+schema+"apportionment_period_cc WHERE customer_id = '"+customer+"' AND product_line = '"+product_line+"' AND year = "+year+"";
			// make to connection to the database.
			
			  con.query(query, (err, result, fields) => {
			    // if any error while executing above query, throw error
			    if (err) throw err;
			    
			    res.setHeader('Content-Type', 'application/json');
		   		res.end(JSON.stringify(result.recordset));

			});
		});
	}catch (error) {
		res.status(500).json({error});
	}
  },

  get_trimestral_forecast_budget_period_cc: function(req, res){
  	var year = req.param('year');
  	var product_line = req.param('product_line');
  	var customer = req.param('customer');
  	var forecast = req.param('forecast');

  	try{
  		sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

		    con = new sql.Request();
		    const query = "SELECT product_line,( (SELECT ene FROM "+schema+"apportionment_forecast_period_cc WHERE customer_id = '"+customer+"' AND product_line = '"+product_line+"' AND year = "+year+" AND forecast = "+forecast+") + (SELECT feb FROM "+schema+"apportionment_forecast_period_cc WHERE customer_id = '"+customer+"' AND product_line = '"+product_line+"' AND year = "+year+" AND forecast = "+forecast+") + (SELECT mar FROM "+schema+"apportionment_forecast_period_cc WHERE customer_id = '"+customer+"' AND product_line = '"+product_line+"' AND year = "+year+" AND forecast = "+forecast+")) AS Q1, ( (SELECT abr FROM "+schema+"apportionment_forecast_period_cc WHERE customer_id = '"+customer+"' AND product_line = '"+product_line+"' AND year = "+year+" AND forecast = "+forecast+") + (SELECT may FROM "+schema+"apportionment_forecast_period_cc WHERE customer_id = '"+customer+"' AND product_line = '"+product_line+"' AND year = "+year+" AND forecast = "+forecast+") + (SELECT jun FROM "+schema+"apportionment_forecast_period_cc WHERE customer_id = '"+customer+"' AND product_line = '"+product_line+"' AND year = "+year+" AND forecast = "+forecast+") ) AS Q2, ( (SELECT jul FROM "+schema+"apportionment_forecast_period_cc WHERE customer_id = '"+customer+"' AND product_line = '"+product_line+"' AND year = "+year+" AND forecast = "+forecast+") + (SELECT ago FROM "+schema+"apportionment_forecast_period_cc WHERE customer_id = '"+customer+"' AND product_line = '"+product_line+"' AND year = "+year+" AND forecast = "+forecast+") + (SELECT sep FROM "+schema+"apportionment_forecast_period_cc WHERE customer_id = '"+customer+"' AND product_line = '"+product_line+"' AND year = "+year+" AND forecast = "+forecast+") ) AS Q3, ( (SELECT oct FROM "+schema+"apportionment_forecast_period_cc WHERE customer_id = '"+customer+"' AND product_line = '"+product_line+"' AND year = "+year+" AND forecast = "+forecast+") + (SELECT nov FROM "+schema+"apportionment_forecast_period_cc WHERE customer_id = '"+customer+"' AND product_line = '"+product_line+"' AND year = "+year+" AND forecast = "+forecast+") + (SELECT dic FROM "+schema+"apportionment_forecast_period_cc WHERE customer_id = '"+customer+"' AND product_line = '"+product_line+"' AND year = "+year+" AND forecast = "+forecast+") ) AS Q4 FROM "+schema+"apportionment_forecast_period_cc WHERE customer_id = '"+customer+"' AND product_line = '"+product_line+"' AND year = "+year+" AND forecast = "+forecast+"";
			// make to connection to the database.
			
			  con.query(query, (err, result, fields) => {
			    // if any error while executing above query, throw error
			    if (err) throw err;
			    
			    res.setHeader('Content-Type', 'application/json');
		   		res.end(JSON.stringify(result.recordset));

			});
		});
  	}catch (error) {
			res.status(500).json({error});
		}
  },

  get_trimestral_forecast_budget_period: function(req, res){
  	var year = req.param('year');
  	var product_line = req.param('product_line');
  	var commercial_zone = req.param('commercial_zone');
  	var forecast = req.param('forecast');

  	try{
  		sql.connect(db_config, function (err) {
    
		    if (err) console.log(err);

		    con = new sql.Request();
		    const query = "SELECT product_line,( (SELECT ene FROM "+schema+"apportionment_forecast_period WHERE commercial_zone = '"+commercial_zone+"' AND product_line = '"+product_line+"' AND year = "+year+" AND forecast = "+forecast+") + (SELECT feb FROM "+schema+"apportionment_forecast_period WHERE commercial_zone = '"+commercial_zone+"' AND product_line = '"+product_line+"' AND year = "+year+" AND forecast = "+forecast+") + (SELECT mar FROM "+schema+"apportionment_forecast_period WHERE commercial_zone = '"+commercial_zone+"' AND product_line = '"+product_line+"' AND year = "+year+" AND forecast = "+forecast+")) AS Q1, ( (SELECT abr FROM "+schema+"apportionment_forecast_period WHERE commercial_zone = '"+commercial_zone+"' AND product_line = '"+product_line+"' AND year = "+year+" AND forecast = "+forecast+") + (SELECT may FROM "+schema+"apportionment_forecast_period WHERE commercial_zone = '"+commercial_zone+"' AND product_line = '"+product_line+"' AND year = "+year+" AND forecast = "+forecast+") + (SELECT jun FROM "+schema+"apportionment_forecast_period WHERE commercial_zone = '"+commercial_zone+"' AND product_line = '"+product_line+"' AND year = "+year+" AND forecast = "+forecast+") ) AS Q2, ( (SELECT jul FROM "+schema+"apportionment_forecast_period WHERE commercial_zone = '"+commercial_zone+"' AND product_line = '"+product_line+"' AND year = "+year+" AND forecast = "+forecast+") + (SELECT ago FROM "+schema+"apportionment_forecast_period WHERE commercial_zone = '"+commercial_zone+"' AND product_line = '"+product_line+"' AND year = "+year+" AND forecast = "+forecast+") + (SELECT sep FROM "+schema+"apportionment_forecast_period WHERE commercial_zone = '"+commercial_zone+"' AND product_line = '"+product_line+"' AND year = "+year+" AND forecast = "+forecast+") ) AS Q3, ( (SELECT oct FROM "+schema+"apportionment_forecast_period WHERE commercial_zone = '"+commercial_zone+"' AND product_line = '"+product_line+"' AND year = "+year+" AND forecast = "+forecast+") + (SELECT nov FROM "+schema+"apportionment_forecast_period WHERE commercial_zone = '"+commercial_zone+"' AND product_line = '"+product_line+"' AND year = "+year+" AND forecast = "+forecast+") + (SELECT dic FROM "+schema+"apportionment_forecast_period WHERE commercial_zone = '"+commercial_zone+"' AND product_line = '"+product_line+"' AND year = "+year+" AND forecast = "+forecast+") ) AS Q4 FROM "+schema+"apportionment_forecast_period WHERE commercial_zone = '"+commercial_zone+"' AND product_line = '"+product_line+"' AND year = "+year+" AND forecast = "+forecast+"";
			// make to connection to the database.
			
			  con.query(query, (err, result, fields) => {
			    // if any error while executing above query, throw error
			    if (err) throw err;
			    
			    res.setHeader('Content-Type', 'application/json');
		   		res.end(JSON.stringify(result.recordset));

			});
		});
  	}catch (error) {
			res.status(500).json({error});
		}
  },

get_producto: function(req, res){
  	try{
  		sql.connect(db_config, function (err) {
    
		    if (err) console.log(err);

		    con = new sql.Request();
		    const query = "SELECT DISTINCT product_line FROM "+schema+"budget_period";
			 
			// make to connection to the database.
			
			  con.query(query, (err, result, fields) => {
			    // if any error while executing above query, throw error
			    if (err) throw err;

			    // if there is no error, you have the result

			    
			    res.setHeader('Content-Type', 'application/json');
		   		res.end(JSON.stringify(result.recordset));

			});
		});
	}catch (error) {
			res.status(500).json({error});
		}
},

get_product_lines_by_period: function(req,res){
  	var table = req.param('table');


  	try{
  		sql.connect(db_config, function (err) {
    
		    if (err) console.log(err);

		    con = new sql.Request();
		  	const query = "SELECT DISTINCT product_line FROM "+schema+""+table;

		  	con.query(query, (err, result, fields) => {
			    // if any error while executing above query, throw error
			    if (err) throw err;
			    
			    res.setHeader('Content-Type', 'application/json');
		   		res.end(JSON.stringify(result.recordset));

			});
		});
	}catch (error) {
			res.status(500).json({error});
		}
},

get_subfamily_by_product_line: function(req,res){
  	var table = req.param('table');
  	var product_line = req.param('product_line');

  	try{
  		sql.connect(db_config, function (err) {
    
		    if (err) console.log(err);

		    con = new sql.Request();
	  	
		  	const query = "SELECT DISTINCT product_line_subfamily FROM "+schema+""+table+" WHERE product_line = '"+product_line+"'";

		  	con.query(query, (err, result, fields) => {
			    // if any error while executing above query, throw error
			    if (err) throw err;
			    
			    res.setHeader('Content-Type', 'application/json');
		   		res.end(JSON.stringify(result.recordset));

			});
		});
	}catch (error) {
			res.status(500).json({error});
		}
},

get_last_four_months: function(req,res){
  	var product_line = req.param('product_line');
  	
  	try{
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT product_line, SEP,OCT,NOV,DIC FROM "+schema+"forecast_sub_years WHERE product_line ='"+product_line+"'";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
	}catch (error) {
			res.status(500).json({error});
		}
},

get_data_paso_tres: function(req,res){
  	var product_line = req.param('product_line');
  	var year1 = req.param('year1');
  	var year2 = req.param('year2');
  	var year3 = req.param('year3');
  	var year = req.param('year');
  	var commercial_zone = req.param('commercial_zone');

  	try{
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT product_line,(SELECT ISNULL(ROUND(SUM(m2), 2), 0) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year2+") as year1, (SELECT ISNULL(ROUND(SUM(m2), 2), 0) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year3+") as year2, (SELECT Isnull(Round(tot, 2), 0) FROM "+schema+"budget_period_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') as year3 FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line;";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
	}catch (error) {
			res.status(500).json({error});
		}
},


get_data_paso_tres_cc: function(req,res){
  	var product_line = req.param('product_line');
  	var year3 = req.param('year3');
  	var year2 = req.param('year2');
  	var year1 = req.param('year1');
  	var year = req.param('year');
  	var customer = req.param('customer');

  	try{
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();

	  	const query = "SELECT product_line,(SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year3+" AND customer_id = "+customer+") AS year3, (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year2+" AND customer_id = "+customer+") AS year2, (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year1+" AND customer_id = "+customer+") AS year1 FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id = "+customer+" GROUP BY product_line;";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
	}catch (error) {
			res.status(500).json({error});
		}
},

get_data_forecast_paso_tres_cc: function(req,res){
  	var product_line = req.param('product_line');
  	var year3 = req.param('year3');
  	var year2 = req.param('year2');
  	var year1 = req.param('year1');
  	var year = req.param('year');
  	var customer = req.param('customer');
  	var forecast = req.param('forecast');

  	try{
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();

	  	//const query = "SELECT product_line,(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year3+" AND customer_id = "+customer+") AS year3, (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year2+" AND customer_id = "+customer+") AS year2, (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year1+" AND customer_id = "+customer+") AS year1 FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id = "+customer+" GROUP BY product_line;";
	  	const query = "SELECT product_line,(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year2+" AND customer_id = "+customer+") AS year3, (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year1+" AND customer_id = "+customer+") AS year2, (SELECT Isnull(Round(TOT, 2), 0) FROM "+schema+"forecast_con_cc WHERE product_line = '"+product_line+"' AND year = "+year+" AND customer_id = "+customer+" AND FORECAST = "+forecast+") AS year1 FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id = "+customer+" GROUP BY product_line;";

	  	
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
	}catch (error) {
			res.status(500).json({error});
		}
},

get_data_paso_tres_all_cc: function(req,res){
  	var product_line = req.param('product_line');
  	var year3 = req.param('year3');
  	var year2 = req.param('year2');
  	var year1 = req.param('year1');
  	var year = req.param('year');
  	var customer = req.param('customer');

  	try{
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();

	  	const query = "SELECT product_line,(SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year3+" AND customer_id IN ( "+customer+")) AS year3, (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year2+" AND customer_id IN ( "+customer+" )) AS year2, (SELECT ISNULL(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND year = "+year1+" AND customer_id IN ( "+customer+" )) AS year1 FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND customer_id IN ( "+customer+" ) GROUP BY product_line;";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
	}catch (error) {
			res.status(500).json({error});
		}
},

get_existing_total_budget_data_cc: function(req,res){
  	var product_line = req.param('product_line');
  	var year = req.param('year');
  	var customer = req.param('customer');

  	try{
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT product_line,vr_year1,vr_year2,vr_year3,extraord,boyear,cpo,poyear,povs,proyyear,totpyear,povsyear,difyear,partyear FROM "+schema+"total_zone_budget_period_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"';";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
	}catch (error) {
			res.status(500).json({error});
		}
},

get_existing_total_forecast_budget_data_cc: function(req,res){
  	var product_line = req.param('product_line');
  	var year = req.param('year');
  	var customer = req.param('customer');
  	var forecast = req.param('forecast');
  	var i = req.param('i');

  	try{
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	    const query = "SELECT product_line,vr_year1,vr_year2,vr_year3,extraord,'=SUM(D" + i + "-E" + i + ")' AS boyear,cpo,'=SUM(((G" + i + "/100)*F" + i + ")+F" + i + ")' AS poyear,'=SUM(((H" + i + "/F" + i + ")*100))-100' AS povs,proyyear,'=SUM(H" + i + "+J" + i + ")' AS totpyear,'=SUM(((K" + i + "/D" + i + ")*100))-100' AS povsyear,'=SUM(K" + i + "-D" + i + ")' AS difyear,'=SUM((K" + i + "/K16)*100)' AS partyear FROM "+schema+"total_zone_forecast_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND forecast = '"+forecast+"';";

	  	//const query = "SELECT product_line,vr_year1,vr_year2,vr_year3,extraord,boyear,cpo,poyear,povs,proyyear,totpyear,povsyear,difyear,partyear FROM "+schema+"total_zone_forecast_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND forecast = '"+forecast+"';";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
	}catch (error) {
			res.status(500).json({error});
		}
},

get_data_forecast_paso_tres: function(req,res){
  	var product_line = req.param('product_line');
  	var year1 = req.param('year1');
  	var year2 = req.param('year2');
  	var year3 = req.param('year3');
  	var year = req.param('year');
  	var commercial_zone = req.param('commercial_zone');
  	var forecast = req.param('forecast');

  	try{
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	//const query = "SELECT product_line,(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year2+") AS year1, (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year3+") AS year2, (SELECT Isnull(Round(TOT, 2), 0) FROM "+schema+"forecast_con WHERE PRODUCT_LINE = '"+product_line+"' AND year = "+year+" AND COMMERCIAL_ZONE = "+commercial_zone+" AND FORECAST = "+forecast+") AS year3 FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line;";
	  	const query = "SELECT product_line,(SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year2+") AS year1, (SELECT Isnull(Round(Sum(m2), 2), 0) FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = "+year3+") AS year2, (SELECT Isnull(Round(tot, 2), 0) FROM "+schema+"forecast_con WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") AS year3 FROM "+schema+"budget_period_group WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line ";

	  	
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
	}catch (error) {
			res.status(500).json({error});
		}
},

get_existing_total_budget_data: function(req,res){
  	var product_line = req.param('product_line');
  	var year = req.param('year');
  	var commercial_zone = req.param('commercial_zone');


	try{
	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT product_line,vr_year1,vr_year2,vr_year3,extraord,boyear,cpo,poyear,povs,proyyear,totpyear,povsyear,difyear,partyear FROM "+schema+"total_zone_budget_period WHERE commercial_zone = '"+commercial_zone+"' AND year = '"+year+"' AND product_line = '"+product_line+"';";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
	}catch (error) {
			res.status(500).json({error});
		}
},

get_existing_total_forecast_budget_data: function(req,res){
  	var product_line = req.param('product_line');
  	var year = req.param('year');
  	var commercial_zone = req.param('commercial_zone');
  	var forecast = req.param('forecast');
  	var i = req.param('i');


	try{
	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT product_line,vr_year1,vr_year2,vr_year3,extraord,'=SUM(D" + i + "-E" + i + ")' AS boyear,cpo,'=SUM(((G" + i + "/100)*F" + i + ")+F" + i + ")' AS poyear,'=SUM(((H" + i + "/F" + i + ")*100))-100' AS povs,proyyear,'=SUM(H" + i + "+J" + i + ")' AS totpyear,'=SUM(((K" + i + "/D" + i + ")*100))-100' AS povsyear,'=SUM(K" + i + "-D" + i + ")' AS difyear,'=SUM((K" + i + "/K16)*100)' AS partyear FROM "+schema+"total_zone_forecast WHERE commercial_zone = '"+commercial_zone+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND forecast = '"+forecast+"';";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
	}catch (error) {
			res.status(500).json({error});
		}
},

get_poyear: function(req,res){
  	var product_line = req.param('product_line');
  	var year = req.param('year');

  	try{
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT PO FROM "+schema+"budget_period_con WHERE YEAR = "+year+" AND PRODUCTO = '"+product_line+"'";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
	}catch (error) {
			res.status(500).json({error});
		}
},

get_tot_by_year: function(req,res){
  	var product_line = req.param('product_line');
  	var year = req.param('year');
  	var commercial_zone = req.param('commercial_zone');

  	try{
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT ISNULL(ROUND(SUM(m2),2),0) AS TOT FROM "+schema+"budget_period_group WHERE YEAR = "+year+" AND product_line = '"+product_line+"' AND commercial_zone= '"+commercial_zone+"'";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
	}catch (error) {
			res.status(500).json({error});
		}
},

get_tot_by_year_cc: function(req,res){
  	var product_line = req.param('product_line');
  	var year = req.param('year');
  	var customer = req.param('customer');

  	console.log(customer);

  	try{
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();

	  	const query = "SELECT ISNULL(ROUND(SUM(m2),2),0) AS TOT FROM "+schema+"budget_period_group WHERE YEAR = "+year+" AND product_line = '"+product_line+"' AND customer_id = '"+customer+"'";
	  	


	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
	}catch (error) {
			res.status(500).json({error});
		}
},

get_tot_by_year_all_cc: function(req,res){
  	var product_line = req.param('product_line');
  	var year = req.param('year');
  	var customer = req.param('customer');

  	try{
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT ISNULL(ROUND(SUM(m2),2),0) AS TOT FROM "+schema+"budget_period_group WHERE YEAR = "+year+" AND product_line = '"+product_line+"' AND customer_id IN ("+customer+")";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
	}catch (error) {
			res.status(500).json({error});
		}
},

check_if_exist_con: function(req,res){
	var commercial_zone = req.param('commercial_zone');
	var year = req.param('year');
	
	try{
	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
		const query = "SELECT DISTINCT COMMERCIAL_ZONE FROM "+schema+"budget_period_con WHERE COMMERCIAL_ZONE = '"+commercial_zone+"' AND year = '"+year+"'";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
	}catch (error) {
			res.status(500).json({error});
		}
},

check_if_exist_forecast_con: function(req,res){
	var commercial_zone = req.param('commercial_zone');
	var year = req.param('year');
	var forecast = req.param('forecast');
	
	try{
	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
		const query = "SELECT DISTINCT COMMERCIAL_ZONE FROM "+schema+"forecast_con WHERE COMMERCIAL_ZONE = '"+commercial_zone+"' AND year = '"+year+"' AND FORECAST = "+forecast;
		//const query = "SELECT TOP 1 FORECAST FROM `+schema+`forecast_con WHERE COMMERCIAL_ZONE = '"+commercial_zone+"' AND year = '"+year+"' ORDER BY FORECAST DESC";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
	}catch (error) {
			res.status(500).json({error});
		}
},

check_if_exist_con_cc: function(req,res){
	var customer = req.param('customer');
	var year = req.param('year');

	
	try{
	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();

	    const query = "SELECT DISTINCT customer_id FROM "+schema+"budget_period_con_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"'";

	    
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
	}catch (error) {
			res.status(500).json({error});
		}
},

check_if_exist_forecast_con_cc: function(req,res){
	var customer = req.param('customer');
	var year = req.param('year');
	var forecast = req.param('forecast');

	
	try{
	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();

	    const query = "SELECT DISTINCT customer_id FROM "+schema+"forecast_con_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND forecast = '"+forecast+"'" ;

	    
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
	}catch (error) {
			res.status(500).json({error});
		}
},

check_if_exist_total_budget_cc: function(req,res){
	var customer = req.param('customer');
	var year = req.param('year');
	

	try{
	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
		const query = "SELECT DISTINCT customer_id FROM "+schema+"total_zone_budget_period_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"'";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
	}catch (error) {
			res.status(500).json({error});
		}
},

check_if_exist_forecast_total_budget_cc: function(req,res){
	var customer = req.param('customer');
	var year = req.param('year');
	var forecast = req.param('forecast');
	

	try{
	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
		const query = "SELECT DISTINCT customer_id FROM "+schema+"total_zone_forecast_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND forecast = '"+forecast+"'";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
	}catch (error) {
			res.status(500).json({error});
		}
},

check_if_exist_total_budget: function(req,res){
	var commercial_zone = req.param('commercial_zone');
	var year = req.param('year');
	
	try{
	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
		const query = "SELECT DISTINCT commercial_zone FROM "+schema+"total_zone_budget_period WHERE commercial_zone = '"+commercial_zone+"' AND year = '"+year+"'";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
	}catch (error) {
			res.status(500).json({error});
		}
},

check_if_exist_forecast: function(req,res){
	var commercial_zone = req.param('commercial_zone');
	var year = req.param('year');
	var forecast = req.param('forecast');
	
	try{
	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
		const query = "SELECT DISTINCT commercial_zone FROM "+schema+"total_zone_forecast WHERE commercial_zone = '"+commercial_zone+"' AND year = '"+year+"' AND forecast = '"+forecast+"'";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
	}catch (error) {
			res.status(500).json({error});
		}
},

check_if_exist_seller_by_line: function(req,res){
	var commercial_zone = req.param('commercial_zone');
	var year = req.param('year');
	
	try{
	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
		const query = "SELECT DISTINCT commercial_zone FROM "+schema+"seller_by_line WHERE commercial_zone = '"+commercial_zone+"' AND year = '"+year+"'";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
	}catch (error) {
			res.status(500).json({error});
		}
},

check_if_exist_seller_by_line_forecast: function(req,res){
	var commercial_zone = req.param('commercial_zone');
	var year = req.param('year');
	var forecast = req.param('forecast');
	
	try{
	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
		const query = "SELECT DISTINCT commercial_zone FROM "+schema+"seller_by_line_forecast WHERE commercial_zone = '"+commercial_zone+"' AND year = '"+year+"' AND forecast = '"+forecast+"'";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
	}catch (error) {
			res.status(500).json({error});
		}
},

check_if_exist_seller_by_line_cc: function(req,res){
	var customer = req.param('customer');
	var year = req.param('year');
	
	try{
	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
		const query = "SELECT DISTINCT customer_id FROM "+schema+"seller_by_line_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"'";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
	}catch (error) {
			res.status(500).json({error});
		}
},

check_if_exist_entregable_cc: function(req,res){
	var customer = req.param('customer');
	var year = req.param('year');
	
	try{
	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
		const query = "SELECT DISTINCT zona FROM "+schema+"entregable_cc WHERE cliente = '"+customer+"' AND periodo = '"+year+"'";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
	}catch (error) {
			res.status(500).json({error});
		}
},

check_if_exist_entregable: function(req,res){
	var commercial_zone = req.param('commercial_zone');
	var year = req.param('year');
	
	try{
	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
		const query = "SELECT DISTINCT zona FROM "+schema+"entregable WHERE zona = '"+commercial_zone+"' AND periodo = '"+year+"'";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
	}catch (error) {
			res.status(500).json({error});
		}
},

check_if_exist_entregable_forecast: function(req,res){
	var commercial_zone = req.param('commercial_zone');
	var year = req.param('year');
	var forecast = req.param('forecast');

	try{
	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
		const query = "SELECT DISTINCT zona FROM "+schema+"entregable_forecast WHERE zona = '"+commercial_zone+"' AND periodo = '"+year+"' AND forecast = '"+forecast+"'";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
	}catch (error) {
			res.status(500).json({error});
		}
},

get_existing_entregable_forecast: function(req,res){
	var seller = req.param('seller_number');
	var commercial_zone = req.param('commercial_zone');
	var year = req.param('year');
	var forecast = req.param('forecast');

	try{
	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
		const query = "SELECT * FROM "+schema+"entregable_forecast WHERE seller = '"+seller+"' zona = '"+commercial_zone+"' AND periodo = '"+year+"' AND forecast = '"+forecast+"'";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
	}catch (error) {
			res.status(500).json({error});
		}
},


get_paso3_e: function(req,res){
  	var year = req.param('year');
  	var product_line = req.param('product_line');
  	var commercial_zone = req.param('commercial_zone');

  	try{
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	    const query = "SELECT product_line, ENE, FEB, MAR, ABR, MAY, JUN, JUL, AGO, SEP, OCT, NOV, DIC FROM "+schema+"apportionment_period WHERE YEAR = "+year+" AND commercial_zone = '"+commercial_zone+"' AND product_line = '"+product_line+"'";
		
		con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
	}catch (error) {
			res.status(500).json({error});
		}
},

get_paso3_e_forecast: function(req,res){
  	var year = req.param('year');
  	var product_line = req.param('product_line');
  	var commercial_zone = req.param('commercial_zone');
  	var forecast = req.param('forecast');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	    const query = "SELECT product_line, ENE, FEB, MAR, ABR, MAY, JUN, JUL, AGO, SEP, OCT, NOV, DIC FROM "+schema+"apportionment_forecast_period WHERE YEAR = "+year+" AND commercial_zone = '"+commercial_zone+"' AND product_line = '"+product_line+"' AND forecast = '"+forecast+"'";
		
		con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
	
},

get_paso3_e_cc: function(req,res){
  	var year = req.param('year');
  	var product_line = req.param('product_line');
  	var customer = req.param('customer');
    
    sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	    const query = "SELECT product_line, ene, feb, mar, abr, may, jun, jul, ago, sep, oct, nov, dic FROM "+schema+"apportionment_period_cc WHERE year = "+year+" AND customer_id = '"+customer+"' AND product_line = '"+product_line+"' ";
		
		con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},

get_paso3_e_forecast_cc: function(req,res){
  	var year = req.param('year');
  	var product_line = req.param('product_line');
  	var customer = req.param('customer');
  	var forecast = req.param('forecast');
    
    sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	    const query = "SELECT product_line, ene, feb, mar, abr, may, jun, jul, ago, sep, oct, nov, dic FROM "+schema+"apportionment_forecast_period_cc WHERE year = "+year+" AND customer_id = '"+customer+"' AND product_line = '"+product_line+"' AND forecast = '"+forecast+"'";
		
		con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},


/*
get_data_vr_paso_4_cc: function(req,res){
  	var year = req.param('year');
  	var customer = req.param('customer');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT MAX(customer),(SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE month = 1 AND year = "+year+" AND customer_id = '"+customer+"') AS ENE, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE month = 2 AND year = "+year+" AND customer_id = '"+customer+"') AS FEB, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE month = 3 AND year = "+year+" AND customer_id = '"+customer+"') AS MAR, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE month = 4 AND year = "+year+" AND customer_id = '"+customer+"') AS ABR, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE month = 5 AND year = "+year+" AND customer_id = '"+customer+"') AS MAY, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE month = 6 AND year = "+year+" AND customer_id = '"+customer+"') AS JUN, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE month = 7 AND year = "+year+" AND customer_id = '"+customer+"') AS JUL, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE month = 8 AND year = "+year+" AND customer_id = '"+customer+"') AS AGO, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE month = 9 AND year = "+year+" AND customer_id = '"+customer+"') AS SEP, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE month = 10 AND year = "+year+" AND customer_id = '"+customer+"') AS OCT, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE month = 11 AND year = "+year+" AND customer_id = '"+customer+"') AS NOV, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE month = 12 AND year = "+year+" AND customer_id = '"+customer+"') AS DIC FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = "+year+" GROUP BY customer_id";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},
*/

get_data_vr_paso_4_cc: function(req,res){
  	var year = req.param('year');
  	var customer_id = req.param('customer');
  	var forecast = req.param('forecast');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT '"+customer_id+"' AS customer,( (SELECT ene FROM "+schema+"apportionment_forecast_period_cc afpc WHERE customer_id = '"+customer_id+"' AND forecast = "+forecast+") * ( (SELECT poyear FROM "+schema+"total_zone_forecast_cc tzfc WHERE customer_id = '"+customer_id+"' AND forecast = "+forecast+" ) / 100 ) ) AS ENE, ( (SELECT feb FROM "+schema+"apportionment_forecast_period_cc afpc WHERE customer_id = '"+customer_id+"' AND forecast = "+forecast+" ) * ( (SELECT poyear FROM "+schema+"total_zone_forecast_cc tzfc WHERE customer_id = '"+customer_id+"' AND forecast = "+forecast+" ) / 100 ) ) AS FEB, ( (SELECT mar FROM "+schema+"apportionment_forecast_period_cc afpc WHERE customer_id = '"+customer_id+"' AND forecast = "+forecast+" ) * ( (SELECT poyear FROM "+schema+"total_zone_forecast_cc tzfc WHERE customer_id = '"+customer_id+"' AND forecast = "+forecast+" ) / 100 ) ) AS MAR, ( (SELECT abr FROM "+schema+"apportionment_forecast_period_cc afpc WHERE customer_id = '"+customer_id+"' AND forecast = "+forecast+" ) * ( (SELECT poyear FROM "+schema+"total_zone_forecast_cc tzfc WHERE customer_id = '"+customer_id+"' AND forecast = "+forecast+" ) / 100 ) ) AS ABR, ( (SELECT may FROM "+schema+"apportionment_forecast_period_cc afpc WHERE customer_id = '"+customer_id+"' AND forecast = "+forecast+" ) * ( (SELECT poyear FROM "+schema+"total_zone_forecast_cc tzfc WHERE customer_id = '"+customer_id+"' AND forecast = "+forecast+" ) / 100 ) ) AS MAY, ( (SELECT jun FROM "+schema+"apportionment_forecast_period_cc afpc WHERE customer_id = '"+customer_id+"' AND forecast = "+forecast+" ) * ( (SELECT poyear FROM "+schema+"total_zone_forecast_cc tzfc WHERE customer_id = '"+customer_id+"' AND forecast = "+forecast+" ) / 100 ) ) AS JUN, ( (SELECT jul FROM "+schema+"apportionment_forecast_period_cc afpc WHERE customer_id = '"+customer_id+"' AND forecast = "+forecast+" ) * ( (SELECT poyear FROM "+schema+"total_zone_forecast_cc tzfc WHERE customer_id = '"+customer_id+"' AND forecast = "+forecast+" ) / 100 ) ) AS JUL, ( (SELECT ago FROM "+schema+"apportionment_forecast_period_cc afpc WHERE customer_id = '"+customer_id+"' AND forecast = "+forecast+" ) * ( (SELECT poyear FROM "+schema+"total_zone_forecast_cc tzfc WHERE customer_id = '"+customer_id+"' AND forecast = "+forecast+" ) / 100 ) ) AS AGO, ( (SELECT sep FROM "+schema+"apportionment_forecast_period_cc afpc WHERE customer_id = '"+customer_id+"' AND forecast = "+forecast+" ) * ( (SELECT poyear FROM "+schema+"total_zone_forecast_cc tzfc WHERE customer_id = '"+customer_id+"' AND forecast = "+forecast+" ) / 100 ) ) AS SEP, ( (SELECT oct FROM "+schema+"apportionment_forecast_period_cc afpc WHERE customer_id = '"+customer_id+"' AND forecast = "+forecast+" ) * ( (SELECT poyear FROM "+schema+"total_zone_forecast_cc tzfc WHERE customer_id = '"+customer_id+"' AND forecast = "+forecast+" ) / 100 ) ) AS OCT, ( (SELECT nov FROM "+schema+"apportionment_forecast_period_cc afpc WHERE customer_id = '"+customer_id+"' AND forecast = "+forecast+" ) * ( (SELECT poyear FROM "+schema+"total_zone_forecast_cc tzfc WHERE customer_id = '"+customer_id+"' AND forecast = "+forecast+" ) / 100 ) ) AS NOV, ( (SELECT dic FROM "+schema+"apportionment_forecast_period_cc afpc WHERE customer_id = '"+customer_id+"' AND forecast = "+forecast+" ) * ( (SELECT poyear FROM "+schema+"total_zone_forecast_cc tzfc WHERE customer_id = '"+customer_id+"' AND forecast = "+forecast+" ) / 100 ) ) AS DIC, 'SUM=(B1:M1)' AS TOT; ";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},

get_data_vr_paso_4: function(req,res){
  	var year = req.param('year');
  	var commercial_zone = req.param('commercial_zone');
  	//const query = "SELECT commercial_zone,(SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year WHERE month = 1 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS ENE, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year WHERE month = 2 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS FEB, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year WHERE month = 3 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS MAR, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year WHERE month = 4 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS ABR, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year WHERE month = 5 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS MAY, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year WHERE month = 6 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS JUN, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year WHERE month = 7 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS JUL, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year WHERE month = 8 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS AGO, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year WHERE month = 9 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS SEP, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year WHERE month = 10 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS OCT, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year WHERE month = 11 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS NOV, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year WHERE month = 12 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS DIC FROM "+schema+"budget_next_year WHERE commercial_zone = '"+commercial_zone+"' AND year = "+year+" GROUP BY commercial_zone ";
	  	
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT commercial_zone,(SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE month = 1 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS ENE, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE month = 2 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS FEB, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE month = 3 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS MAR, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE month = 4 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS ABR, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE month = 5 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS MAY, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE month = 6 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS JUN, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE month = 7 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS JUL, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE month = 8 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS AGO, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE month = 9 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS SEP, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE month = 10 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS OCT, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE month = 11 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS NOV, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE month = 12 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') AS DIC FROM "+schema+"budget_next_year_cc WHERE commercial_zone = '"+commercial_zone+"' AND year = "+year+" GROUP BY commercial_zone ";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},

get_data_vr_forecast_paso_4: function(req,res){
  	var year = req.param('year');
  	var forecast = req.param('forecast');
  	var commercial_zone = req.param('commercial_zone');	  	
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT commercial_zone,(SELECT Sum(annual_growth_m2) FROM "+schema+"forecast_next_year WHERE month = 1 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") AS ENE, (SELECT Sum(annual_growth_m2) FROM "+schema+"forecast_next_year WHERE month = 2 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") AS FEB, (SELECT Sum(annual_growth_m2) FROM "+schema+"forecast_next_year WHERE month = 3 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") AS MAR, (SELECT Sum(annual_growth_m2) FROM "+schema+"forecast_next_year WHERE month = 4 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") AS ABR, (SELECT Sum(annual_growth_m2) FROM "+schema+"forecast_next_year WHERE month = 5 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") AS MAY, (SELECT Sum(annual_growth_m2) FROM "+schema+"forecast_next_year WHERE month = 6 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") AS JUN, (SELECT Sum(annual_growth_m2) FROM "+schema+"forecast_next_year WHERE month = 7 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") AS JUL, (SELECT Sum(annual_growth_m2) FROM "+schema+"forecast_next_year WHERE month = 8 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") AS AGO, (SELECT Sum(annual_growth_m2) FROM "+schema+"forecast_next_year WHERE month = 9 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") AS SEP, (SELECT Sum(annual_growth_m2) FROM "+schema+"forecast_next_year WHERE month = 10 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") AS OCT, (SELECT Sum(annual_growth_m2) FROM "+schema+"forecast_next_year WHERE month = 11 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") AS NOV, (SELECT Sum(annual_growth_m2) FROM "+schema+"forecast_next_year WHERE month = 12 AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+") AS DIC FROM "+schema+"forecast_next_year WHERE commercial_zone = '"+commercial_zone+"' AND year = "+year+" AND forecast = "+forecast+" GROUP BY commercial_zone";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},


get_product_lines_by_seller_cc: function(req,res){
  	var seller_number = req.param('seller_number');
  	var year = req.param('year');
  	var customer_id = req.param('customer_id');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
  		const query = "SELECT product_line FROM "+schema+"budget_next_year_cc WHERE seller_number = '"+seller_number+"' AND year = '"+year+"' AND customer_id = '"+customer_id+"' GROUP BY product_line";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},

get_product_lines_by_seller: function(req,res){
  	var seller_number = req.param('seller_number');
  	var year = req.param('year');
  	var commercial_zone = req.param('commercial_zone');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT product_line FROM "+schema+"budget_next_year_cc WHERE seller_number = '"+seller_number+"' AND year = '"+year+"' AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},

get_product_lines_by_seller_forecast: function(req,res){
  	var seller_number = req.param('seller_number');
  	var year = req.param('year');
  	var commercial_zone = req.param('commercial_zone');
  	var forecast = req.param('forecast');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT product_line FROM "+schema+"forecast_next_year WHERE seller_number = '"+seller_number+"' AND year = '"+year+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = '"+forecast+"' GROUP BY product_line ";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},

get_data_tiendas_seller_bypd_paso_5_cc: function(req,res){
  	var year = req.param('year');
  	var customer = req.param('customer');
  	var seller = req.param('seller');
  	var product_line = req.param('product_line');
  	var tienda = req.param('tienda');

  	//const query = "SELECT tienda_desc as product_line,(SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 1 AND seller_number = "+seller+" AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = "+customer+") AS ENE, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 2 AND seller_number = "+seller+" AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = "+customer+") AS FEB, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 3 AND seller_number = "+seller+" AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = "+customer+") AS MAR, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 4 AND seller_number = "+seller+" AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = "+customer+") AS ABR, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 5 AND seller_number = "+seller+" AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = "+customer+") AS MAY, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 6 AND seller_number = "+seller+" AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = "+customer+") AS JUN, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 7 AND seller_number = "+seller+" AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = "+customer+") AS JUL, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 8 AND seller_number = "+seller+" AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = "+customer+") AS AGO, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 9 AND seller_number = "+seller+" AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = "+customer+") AS SEP, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 10 AND seller_number = "+seller+" AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = "+customer+") AS OCT, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 11 AND seller_number = "+seller+" AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = "+customer+") AS NOV, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 12 AND seller_number = "+seller+" AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = "+customer+") AS DIC FROM "+schema+"budget_next_year_cc WHERE customer_id = "+customer+" AND seller_number = "+seller+" AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' GROUP BY tienda_desc";
  	/*/*!Con incremento en metros!///*/// const query = "SELECT tienda_desc as product_line, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 1 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"') AS ENE, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 2 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"') AS FEB, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 3 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"') AS MAR, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 4 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"') AS ABR, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 5 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"') AS MAY, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 6 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"') AS JUN, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 7 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"') AS JUL, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 8 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"') AS AGO, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 9 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"') AS SEP, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 10 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"') AS OCT, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 11 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"') AS NOV, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 12 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"') AS DIC FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' GROUP BY tienda_desc";
  	//Con incremento en porcentaje!////const query = "SELECT tienda_desc AS product_line,((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 1 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 1)) AS ENE, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 2 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 2)) AS FEB, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 3 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 3)) AS MAR, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 4 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 4)) AS ABR, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 5 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 5)) AS MAY, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 6 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 6)) AS JUN, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 7 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 7)) AS JUL, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 8 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 8)) AS AGO, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 9 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 9)) AS SEP, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 10 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 10)) AS OCT, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 11 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 11)) AS NOV, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 12 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 12)) AS DIC FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' GROUP BY product_line";
	const query = "SELECT tienda_desc AS product_line,(SELECT Isnull(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE seller_number = "+seller+" AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = "+customer+") *((SELECT ENE FROM "+schema+"apportionment_forecast_period_cc WHERE customer_id = "+customer+" AND year = "+year+" AND product_line = '"+product_line+"')/100) AS ENE, (SELECT Isnull(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE seller_number = "+seller+" AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = "+customer+") *((SELECT FEB FROM "+schema+"apportionment_forecast_period_cc WHERE customer_id = "+customer+" AND year = "+year+" AND product_line = '"+product_line+"')/100) AS FEB, (SELECT Isnull(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE seller_number = "+seller+" AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = "+customer+") *((SELECT MAR FROM "+schema+"apportionment_forecast_period_cc WHERE customer_id = "+customer+" AND year = "+year+" AND product_line = '"+product_line+"')/100) AS MAR, (SELECT Isnull(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE seller_number = "+seller+" AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = "+customer+") *((SELECT ABR FROM "+schema+"apportionment_forecast_period_cc WHERE customer_id = "+customer+" AND year = "+year+" AND product_line = '"+product_line+"')/100) AS ABR, (SELECT Isnull(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE seller_number = "+seller+" AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = "+customer+") *((SELECT MAY FROM "+schema+"apportionment_forecast_period_cc WHERE customer_id = "+customer+" AND year = "+year+" AND product_line = '"+product_line+"')/100) AS MAY, (SELECT Isnull(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE seller_number = "+seller+" AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = "+customer+") *((SELECT JUN FROM "+schema+"apportionment_forecast_period_cc WHERE customer_id = "+customer+" AND year = "+year+" AND product_line = '"+product_line+"')/100) AS JUN, (SELECT Isnull(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE seller_number = "+seller+" AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = "+customer+") *((SELECT JUL FROM "+schema+"apportionment_forecast_period_cc WHERE customer_id = "+customer+" AND year = "+year+" AND product_line = '"+product_line+"')/100) AS JUL, (SELECT Isnull(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE seller_number = "+seller+" AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = "+customer+") *((SELECT AGO FROM "+schema+"apportionment_forecast_period_cc WHERE customer_id = "+customer+" AND year = "+year+" AND product_line = '"+product_line+"')/100) AS AGO, (SELECT Isnull(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE seller_number = "+seller+" AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = "+customer+") *((SELECT SEP FROM "+schema+"apportionment_forecast_period_cc WHERE customer_id = "+customer+" AND year = "+year+" AND product_line = '"+product_line+"')/100) AS SEP, (SELECT Isnull(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE seller_number = "+seller+" AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = "+customer+") *((SELECT OCT FROM "+schema+"apportionment_forecast_period_cc WHERE customer_id = "+customer+" AND year = "+year+" AND product_line = '"+product_line+"')/100) AS OCT, (SELECT Isnull(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE seller_number = "+seller+" AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = "+customer+") *((SELECT NOV FROM "+schema+"apportionment_forecast_period_cc WHERE customer_id = "+customer+" AND year = "+year+" AND product_line = '"+product_line+"')/100) AS NOV, (SELECT Isnull(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE seller_number = "+seller+" AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = "+customer+") *((SELECT DIC FROM "+schema+"apportionment_forecast_period_cc WHERE customer_id = "+customer+" AND year = "+year+" AND product_line = '"+product_line+"')/100) AS DIC FROM "+schema+"budget_next_year_cc WHERE customer_id = "+customer+" AND seller_number = "+seller+" AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' GROUP BY tienda_desc";

	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},



get_existing_data_tiendas_seller_bypd_paso_5_cc: function(req,res){
  	var year = req.param('year');
  	var customer = req.param('customer');
  	var seller = req.param('seller');
  	var product_line = req.param('product_line');
  	var tienda = req.param('tienda');

  	const query = "SELECT B.tienda_desc as product_line, A.ene AS ene, A.feb AS feb, A.mar AS mar, A.abr AS abr, A.may AS may, A.jun AS jun, A.jul AS jul, A.ago AS ago, A.sep AS sep, A.oct AS oct, A.nov AS nov, A.dic AS dic FROM "+schema+"entregable_cc A JOIN "+schema+"stores_cc B ON A.tienda = B.tienda WHERE A.periodo = "+year+" AND A.cliente = '"+customer+"' AND A.clave_vendedor = "+seller+" AND A.desc_linea = '"+product_line+"' AND A.tienda = '"+tienda+"'";
  	/*/*!Con incremento en metros!///*/// const query = "SELECT tienda_desc as product_line, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 1 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"') AS ENE, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 2 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"') AS FEB, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 3 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"') AS MAR, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 4 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"') AS ABR, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 5 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"') AS MAY, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 6 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"') AS JUN, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 7 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"') AS JUL, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 8 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"') AS AGO, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 9 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"') AS SEP, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 10 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"') AS OCT, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 11 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"') AS NOV, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 12 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"') AS DIC FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' GROUP BY tienda_desc";
  	//Con incremento en porcentaje!////const query = "SELECT tienda_desc AS product_line,((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 1 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 1)) AS ENE, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 2 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 2)) AS FEB, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 3 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 3)) AS MAR, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 4 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 4)) AS ABR, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 5 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 5)) AS MAY, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 6 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 6)) AS JUN, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 7 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 7)) AS JUL, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 8 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 8)) AS AGO, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 9 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 9)) AS SEP, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 10 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 10)) AS OCT, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 11 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 11)) AS NOV, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 12 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 12)) AS DIC FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' GROUP BY product_line";
	
	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},

get_data_tiendas_seller_bypd_paso_5: function(req,res){
  	var year = req.param('year');
  	var commercial_zone = req.param('commercial_zone');
  	var seller = req.param('seller');
  	var product_line = req.param('product_line');
  	var customer_id = req.param('customer_id');
  	/*/*!Con incremento en metros!///*/ //const query = "SELECT customer AS product_line,(SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year WHERE month = 1 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"') AS ENE, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year WHERE month = 2 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"') AS FEB, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year WHERE month = 3 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"') AS MAR, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year WHERE month = 4 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"') AS ABR, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year WHERE month = 5 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"') AS MAY, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year WHERE month = 6 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"') AS JUN, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year WHERE month = 7 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"') AS JUL, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year WHERE month = 8 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"') AS AGO, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year WHERE month = 9 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"') AS SEP, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year WHERE month = 10 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"') AS OCT, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year WHERE month = 11 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"') AS NOV, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year WHERE month = 12 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"') AS DIC FROM "+schema+"budget_next_year WHERE customer_id = '"+customer_id+"' AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line";
  	//Con incremento en porcentaje!////const query = "SELECT tienda_desc AS product_line,((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 1 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 1)) AS ENE, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 2 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 2)) AS FEB, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 3 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 3)) AS MAR, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 4 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 4)) AS ABR, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 5 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 5)) AS MAY, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 6 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 6)) AS JUN, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 7 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 7)) AS JUL, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 8 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 8)) AS AGO, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 9 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 9)) AS SEP, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 10 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 10)) AS OCT, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 11 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 11)) AS NOV, ((SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 12 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' AND customer_id = '"+customer+"')* 100 / (SELECT Sum(last_year_budget) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 12)) AS DIC FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND tienda = '"+tienda+"' GROUP BY product_line";
  	//const query = "SELECT customer AS product_line,(SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 1 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"') AS ENE, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 2 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"') AS FEB, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 3 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"') AS MAR, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 4 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"') AS ABR, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 5 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"') AS MAY, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 6 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"') AS JUN, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 7 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"') AS JUL, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 8 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"') AS AGO, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 9 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"') AS SEP, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 10 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"') AS OCT, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 11 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"') AS NOV, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 12 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"') AS DIC FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer_id+"' AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line ";
  	
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT customer AS product_line,( SELECT ( ISNULL(Sum(annual_growth_m2), 0)) * ( (SELECT ENE FROM "+schema+"apportionment_forecast_period WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') / 100 ) AS TOT FROM "+schema+"budget_next_year_cc WHERE seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"' ) AS ENE, ( SELECT ( ISNULL(Sum(annual_growth_m2), 0) ) * ( (SELECT FEB FROM "+schema+"apportionment_forecast_period WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') / 100 ) AS TOT FROM "+schema+"budget_next_year_cc WHERE seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"' ) AS FEB, ( SELECT ( ISNULL(Sum(annual_growth_m2), 0) ) * ( (SELECT MAR FROM "+schema+"apportionment_forecast_period WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') / 100 ) AS TOT FROM "+schema+"budget_next_year_cc WHERE seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"' ) AS MAR, ( SELECT ( ISNULL(Sum(annual_growth_m2), 0) ) * ( (SELECT ABR FROM "+schema+"apportionment_forecast_period WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') / 100 ) AS TOT FROM "+schema+"budget_next_year_cc WHERE seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"' ) AS ABR, ( SELECT ( ISNULL(Sum(annual_growth_m2), 0) ) * ( (SELECT MAY FROM "+schema+"apportionment_forecast_period WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') / 100 ) AS TOT FROM "+schema+"budget_next_year_cc WHERE seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"' ) AS MAY, ( SELECT ( ISNULL(Sum(annual_growth_m2), 0) ) * ( (SELECT JUN FROM "+schema+"apportionment_forecast_period WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') / 100 ) AS TOT FROM "+schema+"budget_next_year_cc WHERE seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"' ) AS JUN, ( SELECT ( ISNULL(Sum(annual_growth_m2), 0) ) * ( (SELECT JUL FROM "+schema+"apportionment_forecast_period WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') / 100 ) AS TOT FROM "+schema+"budget_next_year_cc WHERE seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"' ) AS JUL, ( SELECT ( ISNULL(Sum(annual_growth_m2), 0) ) * ( (SELECT AGO FROM "+schema+"apportionment_forecast_period WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') / 100 ) AS TOT FROM "+schema+"budget_next_year_cc WHERE seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"' ) AS AGO, ( SELECT ( ISNULL(Sum(annual_growth_m2), 0) ) * ( (SELECT SEP FROM "+schema+"apportionment_forecast_period WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') / 100 ) AS TOT FROM "+schema+"budget_next_year_cc WHERE seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"' ) AS SEP, ( SELECT ( ISNULL(Sum(annual_growth_m2), 0) ) * ( (SELECT OCT FROM "+schema+"apportionment_forecast_period WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') / 100 ) AS TOT FROM "+schema+"budget_next_year_cc WHERE seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"' ) AS OCT, ( SELECT ( ISNULL(Sum(annual_growth_m2), 0) ) * ( (SELECT NOV FROM "+schema+"apportionment_forecast_period WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') / 100 ) AS TOT FROM "+schema+"budget_next_year_cc WHERE seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"' ) AS NOV, ( SELECT ( ISNULL(Sum(annual_growth_m2), 0) ) * ( (SELECT DIC FROM "+schema+"apportionment_forecast_period WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"') / 100 ) AS TOT FROM "+schema+"budget_next_year_cc WHERE seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND customer_id = '"+customer_id+"' ) AS DIC FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer_id+"' AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' GROUP BY product_line, customer";
	  	
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},

get_data_tiendas_seller_bypd_paso_5_forecast: function(req,res){
  	var year = req.param('year');
  	var commercial_zone = req.param('commercial_zone');
  	var seller = req.param('seller');
  	var product_line = req.param('product_line');
  	var customer_id = req.param('customer_id');
  	var forecast = req.param('forecast');
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();

	  	const query = "SELECT customer AS product_line,(SELECT ( Isnull(Sum(annual_growth_m2), 0)) * ( (SELECT ene FROM "+schema+"apportionment_forecast_period WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+" ) / 100 ) AS TOT FROM "+schema+"forecast_next_year WHERE seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+" AND customer_id = '"+customer_id+"') AS ENE, (SELECT ( Isnull(Sum(annual_growth_m2), 0) ) * ( (SELECT feb FROM "+schema+"apportionment_forecast_period WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+" ) / 100 ) AS TOT FROM "+schema+"forecast_next_year WHERE seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+" AND customer_id = '"+customer_id+"') AS FEB, (SELECT ( Isnull(Sum(annual_growth_m2), 0) ) * ( (SELECT mar FROM "+schema+"apportionment_forecast_period WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+" ) / 100 ) AS TOT FROM "+schema+"forecast_next_year WHERE seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+" AND customer_id = '"+customer_id+"') AS MAR, (SELECT ( Isnull(Sum(annual_growth_m2), 0) ) * ( (SELECT abr FROM "+schema+"apportionment_forecast_period WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+" ) / 100 ) AS TOT FROM "+schema+"forecast_next_year WHERE seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+" AND customer_id = '"+customer_id+"') AS ABR, (SELECT ( Isnull(Sum(annual_growth_m2), 0) ) * ( (SELECT may FROM "+schema+"apportionment_forecast_period WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+" ) / 100 ) AS TOT FROM "+schema+"forecast_next_year WHERE seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+" AND customer_id = '"+customer_id+"') AS MAY, (SELECT ( Isnull(Sum(annual_growth_m2), 0) ) * ( (SELECT jun FROM "+schema+"apportionment_forecast_period WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+" ) / 100 ) AS TOT FROM "+schema+"forecast_next_year WHERE seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+" AND customer_id = '"+customer_id+"') AS JUN, (SELECT ( Isnull(Sum(annual_growth_m2), 0) ) * ( (SELECT jul FROM "+schema+"apportionment_forecast_period WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+" ) / 100 ) AS TOT FROM "+schema+"forecast_next_year WHERE seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+" AND customer_id = '"+customer_id+"') AS JUL, (SELECT ( Isnull(Sum(annual_growth_m2), 0) ) * ( (SELECT ago FROM "+schema+"apportionment_forecast_period WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+" ) / 100 ) AS TOT FROM "+schema+"forecast_next_year WHERE seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+" AND customer_id = '"+customer_id+"') AS AGO, (SELECT ( Isnull(Sum(annual_growth_m2), 0) ) * ( (SELECT sep FROM "+schema+"apportionment_forecast_period WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+" ) / 100 ) AS TOT FROM "+schema+"forecast_next_year WHERE seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+" AND customer_id = '"+customer_id+"') AS SEP, (SELECT ( Isnull(Sum(annual_growth_m2), 0) ) * ( (SELECT oct FROM "+schema+"apportionment_forecast_period WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+" ) / 100 ) AS TOT FROM "+schema+"forecast_next_year WHERE seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+" AND customer_id = '"+customer_id+"') AS OCT, (SELECT ( Isnull(Sum(annual_growth_m2), 0) ) * ( (SELECT nov FROM "+schema+"apportionment_forecast_period WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+" ) / 100 ) AS TOT FROM "+schema+"forecast_next_year WHERE seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+" AND customer_id = '"+customer_id+"') AS NOV, (SELECT ( Isnull(Sum(annual_growth_m2), 0) ) * ( (SELECT dic FROM "+schema+"apportionment_forecast_period WHERE product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+" ) / 100 ) AS TOT FROM "+schema+"forecast_next_year WHERE seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+" AND customer_id = '"+customer_id+"') AS DIC FROM "+schema+"forecast_next_year WHERE customer_id = '"+customer_id+"' AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast+" GROUP BY product_line, customer";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},

get_existing_data_tiendas_seller_bypd_paso_5: function(req,res){
  	var year = req.param('year');
  	var commercial_zone = req.param('commercial_zone');
  	var seller = req.param('seller');
  	var product_line = req.param('product_line');
  	var customer_id = req.param('customer_id');
  	
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT desc_cliente as product_line, ene, feb, mar, abr, may, jun, jul, ago, sep, oct, nov, dic FROM "+schema+"entregable WHERE periodo = "+year+" AND zona = '"+commercial_zone+"' AND clave_vendedor = "+seller+" AND desc_linea = '"+product_line+"' AND cliente = '"+customer_id+"'";
	
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},


/*
get_data_seller_bypd_paso_4_cc: function(req,res){
  	var year = req.param('year');
  	var customer = req.param('customer');
  	var seller = req.param('seller');
  	var product_line = req.param('product_line');
  	const query = "SELECT DISTINCT product_line,( (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"') * ( (SELECT ene FROM "+schema+" apportionment_forecast_period_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"') / 100) ) AS ENE, ( (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"') * ( (SELECT feb FROM "+schema+" apportionment_forecast_period_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"') / 100 ) ) AS FEB, ( (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"') * ( (SELECT mar FROM "+schema+" apportionment_forecast_period_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"') / 100 ) ) AS MAR, ( (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"') * ( (SELECT abr FROM "+schema+" apportionment_forecast_period_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"') / 100 ) ) AS ABR, ( (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"') * ( (SELECT may FROM "+schema+" apportionment_forecast_period_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"') / 100 ) ) AS MAY, ( (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"') * ( (SELECT jun FROM "+schema+" apportionment_forecast_period_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"') / 100 ) ) AS JUN, ( (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"') * ( (SELECT jul FROM "+schema+" apportionment_forecast_period_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"') / 100 ) ) AS JUL, ( (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"') * ( (SELECT ago FROM "+schema+" apportionment_forecast_period_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"') / 100 ) ) AS AGO, ( (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"') * ( (SELECT sep FROM "+schema+" apportionment_forecast_period_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"') / 100 ) ) AS SEP, ( (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"') * ( (SELECT oct FROM "+schema+" apportionment_forecast_period_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"') / 100 ) ) AS OCT, ( (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"') * ( (SELECT nov FROM "+schema+" apportionment_forecast_period_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"') / 100 ) ) AS NOV, ( (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"') * ( (SELECT dic FROM "+schema+" apportionment_forecast_period_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"' AND product_line = '"+product_line+"') / 100 ) ) AS DIC FROM "+schema+"budget_next_year_cc WHERE product_line = '"+product_line+"' AND year = '"+year+"' AND customer_id = '"+customer+"'";

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},*/

get_venta_by_tienda: function(req,res){
	var tienda = req.param('tienda');
	var year = req.param('year');
  	var customer = req.param('customer');
  	var seller = req.param('seller');
  	var product_line = req.param('product_line');
	//const query = "SELECT ISNULL(SUM(m2),0) AS m2 FROM "+schema+"budget_period_group bpg WHERE year = '"+year+"' AND tienda = '"+tienda+"' AND product_line = '"+product_line+"' AND seller = '"+seller+"' AND customer_id = '"+customer+"'";
	const query = "SELECT ISNULL(Sum(m2),0) AS total_vendedor,(SELECT ISNULL(Sum(m2),0) FROM "+schema+"budget_period_group bpg WHERE year = '"+year+"' AND tienda = '"+tienda+"' AND product_line = '"+product_line+"' AND seller = '"+seller+"' AND customer_id = '"+customer+"') AS total_tienda FROM "+schema+"budget_period_group bpg WHERE year = '"+year+"' AND product_line = '"+product_line+"' AND seller = '"+seller+"' AND customer_id = '"+customer+"'";
	
	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},

get_venta_by_customer: function(req,res){
	var commercial_zone = req.param('commercial_zone');
	var year = req.param('year');
  	var customer = req.param('customer');
  	var seller = req.param('seller');
  	var product_line = req.param('product_line');
	
	const query = "SELECT Isnull(Sum(m2), 0) AS total_vendedor,(SELECT Isnull(Sum(m2), 0) FROM "+schema+"budget_period_group bpg WHERE year = "+year+" AND customer = '"+customer+"' AND product_line = '"+product_line+"' AND seller = '"+seller+"' AND commercial_zone = '"+commercial_zone+"') AS total_customer FROM "+schema+"budget_period_group bpg WHERE year = "+year+" AND product_line = '"+product_line+"' AND seller = '"+seller+"' AND commercial_zone = '"+commercial_zone+"'";

	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},

get_data_seller_bypd_paso_4_cc: function(req,res){
  	var year = req.param('year');
  	var customer = req.param('customer');
  	var seller = req.param('seller');
  	var product_line = req.param('product_line');
  	//const query = "SELECT product_line,ene,feb,mar,abr,may,jun,jul,ago,sep,oct,nov,dic,total FROM "+schema+"seller_by_line_cc sblc WHERE product_line = '"+product_line+"' AND customer_id = '"+customer+"' AND seller_number = '"+seller+"' AND [year] = '"+year+"'";
  	const query = "SELECT product_line,ene,feb,mar,abr,may,jun,jul,ago,sep,oct,nov,dic FROM "+schema+"seller_by_line_cc sblc WHERE seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"'";
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},

get_total_paso_4_cc: function(req,res){
  	var year = req.param('year');
  	var customer = req.param('customer');
  	var seller = req.param('seller');
  	var product_line = req.param('product_line');
  	const query = "SELECT ISNULL(Sum(m2),0) as vendedor, (SELECT ISNULL(Sum(m2),0) FROM "+schema+"budget_period_group WHERE [year] = '"+year+"' AND customer_id = '"+customer+"' AND product_line = '"+product_line+"') as total FROM "+schema+"budget_period_group WHERE seller = '"+seller+"' AND [year] = '"+year+"' AND customer_id = '"+customer+"' AND product_line = '"+product_line+"'";

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},

get_total_paso_4: function(req,res){
  	var year = req.param('year');
  	var commercial_zone = req.param('commercial_zone');
  	var seller = req.param('seller');
  	var product_line = req.param('product_line');
  	const query = "SELECT ISNULL(Sum(m2),0) as vendedor, (SELECT ISNULL(Sum(m2),0) FROM "+schema+"budget_period_group WHERE [year] = '"+year+"' AND commercial_zone = '"+commercial_zone+"' AND product_line = '"+product_line+"') as total FROM "+schema+"budget_period_group WHERE seller = '"+seller+"' AND [year] = '"+year+"' AND commercial_zone = '"+commercial_zone+"' AND product_line = '"+product_line+"'";

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},

/*
get_data_seller_bypd_paso_4: function(req,res){
  	var year = req.param('year');
  	var commercial_zone = req.param('commercial_zone');
  	var seller = req.param('seller');
  	var product_line = req.param('product_line');
  	
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT DISTINCT product_line,(SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE commercial_zone = '"+commercial_zone+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 1) AS ENE, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE commercial_zone = '"+commercial_zone+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 2) AS FEB, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE commercial_zone = '"+commercial_zone+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 3) AS MAR, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE commercial_zone = '"+commercial_zone+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 4) AS ABR, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE commercial_zone = '"+commercial_zone+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 5) AS MAY, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE commercial_zone = '"+commercial_zone+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 6) AS JUN, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE commercial_zone = '"+commercial_zone+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 7) AS JUL, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE commercial_zone = '"+commercial_zone+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 8) AS AGO, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE commercial_zone = '"+commercial_zone+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 9) AS SEP, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE commercial_zone = '"+commercial_zone+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 10) AS OCT, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE commercial_zone = '"+commercial_zone+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 11) AS NOV, (SELECT Sum(annual_growth_m2) FROM "+schema+"budget_next_year_cc WHERE commercial_zone = '"+commercial_zone+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND month = 12) AS DIC FROM "+schema+"budget_next_year_cc WHERE product_line = '"+product_line+"' AND year = '"+year+"' AND commercial_zone = '"+commercial_zone+"'";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},
*/

get_data_seller_bypd_paso_4: function(req,res){
  	var year = req.param('year');
  	var commercial_zone = req.param('commercial_zone');
  	var seller = req.param('seller');
  	var product_line = req.param('product_line');
  	
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT product_line,ene,feb,mar,abr,may,jun,jul,ago,sep,oct,nov,dic FROM "+schema+"seller_by_line WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND seller_number = '"+seller+"' AND [year] = '"+year+"' ";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},

get_data_seller_forecast_bypd_paso_4: function(req,res){
  	var year = req.param('year');
  	var commercial_zone = req.param('commercial_zone');
  	var seller = req.param('seller');
  	var product_line = req.param('product_line');
  	var forecast = req.param('forecast');
  	
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT DISTINCT product_line,(SELECT Sum(annual_growth_m2) FROM "+schema+"forecast_next_year WHERE commercial_zone = '"+commercial_zone+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND forecast = '"+forecast+"' AND month = 1) AS ENE, (SELECT Sum(annual_growth_m2) FROM "+schema+"forecast_next_year WHERE commercial_zone = '"+commercial_zone+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND forecast = '"+forecast+"' AND month = 2) AS FEB, (SELECT Sum(annual_growth_m2) FROM "+schema+"forecast_next_year WHERE commercial_zone = '"+commercial_zone+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND forecast = '"+forecast+"' AND month = 3) AS MAR, (SELECT Sum(annual_growth_m2) FROM "+schema+"forecast_next_year WHERE commercial_zone = '"+commercial_zone+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND forecast = '"+forecast+"' AND month = 4) AS ABR, (SELECT Sum(annual_growth_m2) FROM "+schema+"forecast_next_year WHERE commercial_zone = '"+commercial_zone+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND forecast = '"+forecast+"' AND month = 5) AS MAY, (SELECT Sum(annual_growth_m2) FROM "+schema+"forecast_next_year WHERE commercial_zone = '"+commercial_zone+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND forecast = '"+forecast+"' AND month = 6) AS JUN, (SELECT Sum(annual_growth_m2) FROM "+schema+"forecast_next_year WHERE commercial_zone = '"+commercial_zone+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND forecast = '"+forecast+"' AND month = 7) AS JUL, (SELECT Sum(annual_growth_m2) FROM "+schema+"forecast_next_year WHERE commercial_zone = '"+commercial_zone+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND forecast = '"+forecast+"' AND month = 8) AS AGO, (SELECT Sum(annual_growth_m2) FROM "+schema+"forecast_next_year WHERE commercial_zone = '"+commercial_zone+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND forecast = '"+forecast+"' AND month = 9) AS SEP, (SELECT Sum(annual_growth_m2) FROM "+schema+"forecast_next_year WHERE commercial_zone = '"+commercial_zone+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND forecast = '"+forecast+"' AND month = 10) AS OCT, (SELECT Sum(annual_growth_m2) FROM "+schema+"forecast_next_year WHERE commercial_zone = '"+commercial_zone+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND forecast = '"+forecast+"' AND month = 11) AS NOV, (SELECT Sum(annual_growth_m2) FROM "+schema+"forecast_next_year WHERE commercial_zone = '"+commercial_zone+"' AND seller_number = '"+seller+"' AND year = '"+year+"' AND product_line = '"+product_line+"' AND forecast = '"+forecast+"' AND month = 12) AS DIC FROM "+schema+"forecast_next_year WHERE product_line = '"+product_line+"' AND year = '"+year+"' AND commercial_zone = '"+commercial_zone+"' AND forecast = '"+forecast+"'";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},




get_name_seller: function(req,res){
  	var seller = req.param('seller');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT seller_name FROM "+schema+"vendedores WHERE seller_id = '"+seller+"'";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},

get_name_seller_bypk: function(req,res){
  	var seller_pk = req.param('seller_pk');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT seller_name,commercial_zone FROM "+schema+"vendedores WHERE seller_pk = '"+seller_pk+"'";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},

/*
get_sellers: function(req,res){
  	var seller = req.param('seller');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT * FROM "+schema+"vendedores";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},*/

get_tienda_byname: function(req,res){
  	var tienda_desc = req.param('tienda_desc');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT tienda, commercial_zone FROM "+schema+"stores_cc WHERE tienda_desc =  '"+tienda_desc+"'";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},

get_data_seller_bypd_paso_5_cc: function(req,res){
  	var year = req.param('year');
  	var customer = req.param('customer');
  	var seller = req.param('seller');
  	var product_line = req.param('product_line');
  	const query = "SELECT product_line,(SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 1 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS ENE, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 2 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS FEB, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 3 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS MAR, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 4 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS ABR, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 5 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS MAY, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 6 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS JUN, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 7 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS JUL, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 8 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS AGO, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 9 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS SEP, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 10 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS OCT, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 11 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS NOV, (SELECT ISNULL(Sum(annual_growth_m2), 0) FROM "+schema+"budget_next_year_cc WHERE month = 12 AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND customer_id = '"+customer+"') AS DIC FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" GROUP BY product_line";

	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},

get_sellers_cc: function(req,res){
  	var customer = req.param('customer');
  	var year = req.param('year');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT DISTINCT seller FROM "+schema+"budget_period_group WHERE customer_id = '"+customer+"' AND year = '"+year+"'";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});

},

get_sellers: function(req,res){
  	var commercial_zone = req.param('commercial_zone');
  	var year = req.param('year');
  	

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT DISTINCT seller FROM "+schema+"budget_period_group WHERE commercial_zone = '"+commercial_zone+"' AND year = '"+year+"' AND tienda != 'Devo' AND m2 > 0";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},

get_sellers_tienda_cc: function(req,res){
  	var customer = req.param('customer');
  	var year = req.param('year');
  	

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT DISTINCT seller_number as seller, tienda FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer+"' AND year = '"+year+"'";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},

get_tiendas_by_seller_cid_cc: function(req,res){
  	var seller = req.param('seller');
  	var customer = req.param('customer');
  	var year = req.param('year');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT tienda, MAX(tienda_desc) as tienda_desc FROM "+schema+"budget_next_year_cc WHERE seller_number = '"+seller+"' AND customer_id = '"+customer+"' AND year = '"+year+"' GROUP BY tienda";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});

},

get_customers_by_seller: function(req,res){
  	var seller = req.param('seller');
  	var commercial_zone = req.param('commercial_zone');
  	var year = req.param('year');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT MAX(customer_id) as customer_id, customer FROM "+schema+"budget_next_year_cc WHERE seller_number = '"+seller+"' AND commercial_zone = '"+commercial_zone+"' AND year = '"+year+"' GROUP BY customer";
	  	console.log(query);
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});

},

get_customers_by_seller_forecast: function(req,res){
  	var seller = req.param('seller');
  	var commercial_zone = req.param('commercial_zone');
  	var year = req.param('year');
  	var forecast = req.param('forecast');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT customer_id, customer FROM "+schema+"forecast_next_year WHERE seller_number = '"+seller+"' AND commercial_zone = '"+commercial_zone+"' AND year = '"+year+"' AND forecast = '"+forecast+"' GROUP BY customer_id, customer ";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});

},

get_data_seller_paso_4_cc: function(req,res){
  	var year = req.param('year');
  	var customer = req.param('customer');
  	var seller = req.param('seller');
  	var product_line = req.param('product_line');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT product_line,(SELECT ISNULL(ISNULL(Sum(qty_m2),0),0) FROM "+schema+"budget_period WHERE month = 1 AND seller = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"') AS ENE, (SELECT ISNULL(Sum(qty_m2),0) FROM "+schema+"budget_period WHERE month = 2 AND seller = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"') AS FEB, (SELECT ISNULL(Sum(qty_m2),0) FROM "+schema+"budget_period WHERE month = 3 AND seller = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"') AS MAR, (SELECT ISNULL(Sum(qty_m2),0) FROM "+schema+"budget_period WHERE month = 4 AND seller = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"') AS ABR, (SELECT ISNULL(Sum(qty_m2),0) FROM "+schema+"budget_period WHERE month = 5 AND seller = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"') AS MAY, (SELECT ISNULL(Sum(qty_m2),0) FROM "+schema+"budget_period WHERE month = 6 AND seller = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"') AS JUN, (SELECT ISNULL(Sum(qty_m2),0) FROM "+schema+"budget_period WHERE month = 7 AND seller = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"') AS JUL, (SELECT ISNULL(Sum(qty_m2),0) FROM "+schema+"budget_period WHERE month = 8 AND seller = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"') AS AGO, (SELECT ISNULL(Sum(qty_m2),0) FROM "+schema+"budget_period WHERE month = 9 AND seller = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"') AS SEP, (SELECT ISNULL(Sum(qty_m2),0) FROM "+schema+"budget_period WHERE month = 10 AND seller = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"') AS OCT, (SELECT ISNULL(Sum(qty_m2),0) FROM "+schema+"budget_period WHERE month = 11 AND seller = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"') AS NOV, (SELECT ISNULL(Sum(qty_m2),0) FROM "+schema+"budget_period WHERE month = 12 AND seller = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" AND customer = '"+customer+"') AS DIC FROM "+schema+"budget_period WHERE customer = '"+customer+"' AND seller = '"+seller+"' AND product_line = '"+product_line+"' AND year = "+year+" GROUP BY product_line ";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},

get_existing_data_seller_bypd_paso_4_cc: function(req,res){
  	var year = req.param('year');
  	var customer = req.param('customer');
  	var seller = req.param('seller');
  	var product_line = req.param('product_line');


  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT product_line, ene, feb, mar, abr, may, jun, jul, ago, sep, oct, nov, dic, porcentaje, total FROM "+schema+"seller_by_line_cc WHERE year = '"+year+"' AND customer_id = '"+customer+"' AND seller_number = '"+seller+"' AND product_line = '"+product_line+"'";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},

get_existing_data_seller_bypd_paso_4: function(req,res){
  	var year = req.param('year');
  	var commercial_zone = req.param('commercial_zone');
  	var seller = req.param('seller');
  	var product_line = req.param('product_line');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT product_line, ene, feb, mar, abr, may, jun, jul, ago, sep, oct, nov, dic, porcentaje, total FROM "+schema+"seller_by_line WHERE year = '"+year+"' AND commercial_zone = '"+commercial_zone+"' AND seller_number = '"+seller+"' AND product_line = '"+product_line+"'";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},

get_existing_data_seller_bypd_paso_4_forecast: function(req,res){
  	var year = req.param('year');
  	var commercial_zone = req.param('commercial_zone');
  	var seller = req.param('seller');
  	var product_line = req.param('product_line');
  	var forecast = req.param('forecast');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT product_line, ene, feb, mar, abr, may, jun, jul, ago, sep, oct, nov, dic FROM "+schema+"seller_by_line_forecast WHERE year = '"+year+"' AND commercial_zone = '"+commercial_zone+"' AND seller_number = '"+seller+"' AND product_line = '"+product_line+"' AND forecast = '"+forecast+"'";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},

delete_data_seller_bypd_paso_4_cc: function(req,res){
  	var customer = req.param('customer');
  	var year = req.param('year');


  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "DELETE FROM "+schema+"seller_by_line_cc WHERE customer_id = '"+customer+"' AND YEAR = '"+year+"'";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify({status:200}));


		});
	});

},

delete_data_seller_bypd_paso_5_cc: function(req,res){
  	var customer = req.param('customer');
  	var year = req.param('year');


  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "DELETE FROM "+schema+"entregable_cc WHERE cliente = '"+customer+"' AND periodo = '"+year+"'";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify({status:200}));


		});
	});

},

delete_data_seller_bypd_paso_4: function(req,res){
  	var commercial_zone = req.param('commercial_zone');
  	var year = req.param('year');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();

	  	const query = "DELETE FROM "+schema+"seller_by_line WHERE commercial_zone = '"+commercial_zone+"' AND YEAR = '"+year+"'";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify({status:200}));


		});
	});

},

delete_data_seller_bypd_paso_4_forecast: function(req,res){
  	var commercial_zone = req.param('commercial_zone');
  	var year = req.param('year');
  	var forecast = req.param('forecast');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();

	  	const query = "DELETE FROM "+schema+"seller_by_line_forecast WHERE commercial_zone = '"+commercial_zone+"' AND YEAR = '"+year+"' AND forecast = '"+forecast+"'";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify({status:200}));


		});
	});

},

delete_data_seller_bypd_paso_5: function(req,res){
  	var commercial_zone = req.param('commercial_zone');
  	var year = req.param('year');


  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "DELETE FROM "+schema+"entregable WHERE zona = '"+commercial_zone+"' AND periodo = '"+year+"'";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify({status:200}));


		});
	});

},

delete_data_seller_bypd_paso_5_forecast: function(req,res){
  	var commercial_zone = req.param('commercial_zone');
  	var year = req.param('year');
  	var forecast = req.param('forecast');


  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "DELETE FROM "+schema+"entregable_forecast WHERE zona = '"+commercial_zone+"' AND periodo = '"+year+"' AND forecast = '"+forecast+"'";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify({status:200}));


		});
	});

},

  /* ************************************ PUT ENDPOINTS ********************************************* */

put_budget_period_by_year: function(req,res){
  	var product_line = req.param('product_line');
  	var commercial_zone = req.param('commercial_zone');
  	var year = req.param('year');
  	var product_line_subfamily = req.param('product_line_subfamily');
  	
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "INSERT INTO "+schema+"budget_period_con(YEAR,PRODUCTO,PRODUCT_LINE_SUBFAMILY, SELLER, COMMERCIAL_ZONE, ENE, FEB, MAR, ABR, MAY, JUN, JUL, AGO, SEP, OCT, NOV, DIC, TOT) VALUES('"+year+"','"+product_line+"','','','"+commercial_zone+"',(SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 1 AND product_line = '"+product_line+"'), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 2 AND product_line = '"+product_line+"'), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 3 AND product_line = '"+product_line+"'), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 4 AND product_line = '"+product_line+"'), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 5 AND product_line = '"+product_line+"'), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 6 AND product_line = '"+product_line+"'), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 7 AND product_line = '"+product_line+"'), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 8 AND product_line = '"+product_line+"'), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 9 AND product_line = '"+product_line+"'), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 10 AND product_line = '"+product_line+"'), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 11 AND product_line = '"+product_line+"'), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 12 AND product_line = '"+product_line+"'), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND product_line = '"+product_line+"'))";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
},

put_budget_period_by_year_macrolux: function(req,res){
  	var product_line = req.param('product_line');
  	var commercial_zone = req.param('commercial_zone');
  	var year = req.param('year');
  	var product_line_subfamily = req.param('product_line_subfamily');
  	
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "INSERT INTO "+schema+"budget_period_con(YEAR,PRODUCTO,PRODUCT_LINE_SUBFAMILY, SELLER, COMMERCIAL_ZONE, ENE, FEB, MAR, ABR, MAY, JUN, JUL, AGO, SEP, OCT, NOV, DIC, TOT) VALUES('"+year+"','"+product_line+"','','','"+commercial_zone+"',(SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 1 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"' ), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 2 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"' ), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 3 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"' ), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 4 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"' ), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 5 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"' ), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 6 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"' ), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 7 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"' ), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 8 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"' ), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 9 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"' ), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 10 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"' ), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 11 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"' ), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 12 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"' ), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"' ))";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
},

put_budget_period_by_year_macrolux_corrugado: function(req,res){
  	var product_line = req.param('product_line');
  	var commercial_zone = req.param('commercial_zone');
  	var year = req.param('year');
  	var product_line_subfamily = req.param('product_line_subfamily');
  	
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "INSERT INTO "+schema+"budget_period_con(YEAR,PRODUCTO,PRODUCT_LINE_SUBFAMILY, SELLER, COMMERCIAL_ZONE, ENE, FEB, MAR, ABR, MAY, JUN, JUL, AGO, SEP, OCT, NOV, DIC, TOT) VALUES('"+year+"','MACROLUX CORRUGADO','"+product_line_subfamily+"','','"+commercial_zone+"',(SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 1 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"'), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 2 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"'), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 3 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"'), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 4 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"'), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 5 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"'), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 6 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"'), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 7 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"'), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 8 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"'), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 9 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"'), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 10 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"'), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 11 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"'), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND month = 12 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"'), (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_"+year+" WHERE commercial_zone = '"+commercial_zone+"' AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"'))";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
},

put_average_three_years: function(req,res){
  	var product_line = req.param('product_line');
  	var commercial_zone = req.param('commercial_zone');
  	var product_line_subfamily = req.param('product_line_subfamily');


  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
		const query = "INSERT INTO "+schema+"forecast_sub_years(product_line,PRODUCT_LINE_SUBFAMILY,SELLER,COMMERCIAL_ZONE, ENE, FEB, MAR, ABR, MAY, JUN, JUL, AGO, SEP, OCT, NOV, DIC, TOT) VALUES('"+product_line+"','','','"+commercial_zone+"',(((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 1 AND product_line = '"+product_line+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 1 AND product_line = '"+product_line+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 1 AND product_line = '"+product_line+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 2 AND product_line = '"+product_line+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 2 AND product_line = '"+product_line+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 2 AND product_line = '"+product_line+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 3 AND product_line = '"+product_line+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 3 AND product_line = '"+product_line+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 3 AND product_line = '"+product_line+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 4 AND product_line = '"+product_line+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 4 AND product_line = '"+product_line+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 4 AND product_line = '"+product_line+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 5 AND product_line = '"+product_line+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 5 AND product_line = '"+product_line+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 5 AND product_line = '"+product_line+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 6 AND product_line = '"+product_line+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 6 AND product_line = '"+product_line+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 6 AND product_line = '"+product_line+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 7 AND product_line = '"+product_line+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 7 AND product_line = '"+product_line+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 7 AND product_line = '"+product_line+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 8 AND product_line = '"+product_line+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 8 AND product_line = '"+product_line+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 8 AND product_line = '"+product_line+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 9 AND product_line = '"+product_line+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 9 AND product_line = '"+product_line+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 9 AND product_line = '"+product_line+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 10 AND product_line = '"+product_line+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 10 AND product_line = '"+product_line+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 10 AND product_line = '"+product_line+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 11 AND product_line = '"+product_line+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 11 AND product_line = '"+product_line+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 11 AND product_line = '"+product_line+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 12 AND product_line = '"+product_line+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 12 AND product_line = '"+product_line+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 12 AND product_line = '"+product_line+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND product_line = '"+product_line+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND product_line = '"+product_line+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND product_line = '"+product_line+"'))/3))";
	  	
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
	 
},

put_average_three_years_macrolux: function(req,res){
  	var product_line = req.param('product_line');
  	var commercial_zone = req.param('commercial_zone');
  	var product_line_subfamily = req.param('product_line_subfamily');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "INSERT INTO "+schema+"forecast_sub_years(product_line,PRODUCT_LINE_SUBFAMILY,SELLER,COMMERCIAL_ZONE, ENE, FEB, MAR, ABR, MAY, JUN, JUL, AGO, SEP, OCT, NOV, DIC, TOT) VALUES('"+product_line+"','','','"+commercial_zone+"',(((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 1 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 1 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 1 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 2 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 2 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 2 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 3 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 3 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 3 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 4 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 4 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 4 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 5 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 5 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 5 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 6 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 6 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 6 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 7 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 7 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 7 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 8 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 8 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 8 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 9 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 9 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 9 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 10 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 10 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 10 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 11 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 11 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 11 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 12 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 12 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 12 AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND product_line = '"+product_line+"' AND product_line_subfamily != '"+product_line_subfamily+"'))/3))";
	  
	  	
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
	 
},

put_average_three_years_macrolux_corrugado: function(req,res){
  	var product_line = req.param('product_line');
  	var commercial_zone = req.param('commercial_zone');
  	var product_line_subfamily = req.param('product_line_subfamily');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "INSERT INTO "+schema+"forecast_sub_years(product_line,PRODUCT_LINE_SUBFAMILY,SELLER,COMMERCIAL_ZONE, ENE, FEB, MAR, ABR, MAY, JUN, JUL, AGO, SEP, OCT, NOV, DIC, TOT) VALUES('"+product_line+"','"+product_line_subfamily+"','','"+commercial_zone+"',(((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 1 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 1 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 1 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 2 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 2 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 2 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 3 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 3 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 3 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 4 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 4 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 4 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 5 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 5 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 5 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 6 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 6 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 6 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 7 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 7 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 7 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 8 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 8 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 8 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 9 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 9 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 9 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 10 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 10 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 10 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 11 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 11 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 11 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND month = 12 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND month = 12 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND month = 12 AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"'))/3), (((SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2017 WHERE commercial_zone = '"+commercial_zone+"' AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2018 WHERE commercial_zone = '"+commercial_zone+"' AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"') + (SELECT ISNULL(SUM(qty_m2),0) FROM "+schema+"budget_period_2019 WHERE commercial_zone = '"+commercial_zone+"' AND product_line = '"+product_line+"' AND product_line_subfamily = '"+product_line_subfamily+"'))/3))";
	  
	  	
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	}); 
},

put_budgetperiod_closed_by_zone: function(req,res){
  	var year = req.param('year');
  	var commercial_zone = req.param('commercial_zone');
  	var product_line = req.param('product_line');
  	var ene = req.param('ene');
  		ene = ene.replace(/[,]/g,'');
  	var feb = req.param('feb');
  		feb = feb.replace(/[,]/g,'');
  	var mar = req.param('mar');
  		mar = mar.replace(/[,]/g,'');
  	var abr = req.param('abr');
  		abr = abr.replace(/[,]/g,'');
  	var may = req.param('may');
  		may = may.replace(/[,]/g,'');
  	var jun = req.param('jun');
  		jun = jun.replace(/[,]/g,'');
  	var jul = req.param('jul');
  		jul = jul.replace(/[,]/g,'');
  	var ago = req.param('ago');
  		ago = ago.replace(/[,]/g,'');
  	var sep = req.param('sep');
  		sep = sep.replace(/[,]/g,'');
  	var oct = req.param('oct');
  		oct = oct.replace(/[,]/g,'');
  	var nov = req.param('nov');
  		nov = nov.replace(/[,]/g,'');
  	var dic = req.param('dic');
  		dic = dic.replace(/[,]/g,'');

  	var tot = parseFloat(ene)+parseFloat(feb)+parseFloat(mar)+parseFloat(abr)+parseFloat(may)+parseFloat(jun)+parseFloat(jul)+parseFloat(ago)+parseFloat(sep)+parseFloat(oct)+parseFloat(nov)+parseFloat(dic);

	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
		const query = "INSERT INTO "+schema+"budget_period_con(YEAR, PRODUCT_LINE, COMMERCIAL_ZONE, ENE, FEB, MAR, ABR, MAY, JUN, JUL, AGO, SEP, OCT, NOV, DIC, TOT, STATUS) VALUES ('"+year+"','"+product_line+"','"+commercial_zone+"','"+ene+"','"+feb+"','"+mar+"','"+abr+"','"+may+"','"+jun+"','"+jul+"','"+ago+"','"+sep+"','"+oct+"','"+nov+"','"+dic+"','"+tot+"',1)";
	  	
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));


		});
	});
},

put_forecast_closed_by_zone: function(req,res){
	var year = req.param('year');
  	var commercial_zone = req.param('commercial_zone');
  	var product_line = req.param('product_line');
  	var ene = req.param('ene');
  		ene = ene.replace(/[,]/g,'');
  	var feb = req.param('feb');
  		feb = feb.replace(/[,]/g,'');
  	var mar = req.param('mar');
  		mar = mar.replace(/[,]/g,'');
  	var abr = req.param('abr');
  		abr = abr.replace(/[,]/g,'');
  	var may = req.param('may');
  		may = may.replace(/[,]/g,'');
  	var jun = req.param('jun');
  		jun = jun.replace(/[,]/g,'');
  	var jul = req.param('jul');
  		jul = jul.replace(/[,]/g,'');
  	var ago = req.param('ago');
  		ago = ago.replace(/[,]/g,'');
  	var sep = req.param('sep');
  		sep = sep.replace(/[,]/g,'');
  	var oct = req.param('oct');
  		oct = oct.replace(/[,]/g,'');
  	var nov = req.param('nov');
  		nov = nov.replace(/[,]/g,'');
  	var dic = req.param('dic');
  		dic = dic.replace(/[,]/g,'');

  	var tot = parseFloat(ene)+parseFloat(feb)+parseFloat(mar)+parseFloat(abr)+parseFloat(may)+parseFloat(jun)+parseFloat(jul)+parseFloat(ago)+parseFloat(sep)+parseFloat(oct)+parseFloat(nov)+parseFloat(dic);

  	var forecast = req.param('forecast');

	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
		const query = "INSERT INTO "+schema+"forecast_con(YEAR, PRODUCT_LINE, COMMERCIAL_ZONE, ENE, FEB, MAR, ABR, MAY, JUN, JUL, AGO, SEP, OCT, NOV, DIC, TOT, STATUS,FORECAST) VALUES ('"+year+"','"+product_line+"','"+commercial_zone+"','"+ene+"','"+feb+"','"+mar+"','"+abr+"','"+may+"','"+jun+"','"+jul+"','"+ago+"','"+sep+"','"+oct+"','"+nov+"','"+dic+"','"+tot+"',1,'"+forecast+"')";
	  	
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));


		});
	});
},

update_vr1: function(req,res){
	var year = req.param('year');
  	var commercial_zone = req.param('commercial_zone');
  	var product_line = req.param('product_line');
  	
  	var tot = req.param('tot');

  	var forecast = req.param('forecast');

	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
		const query = "UPDATE "+schema+"total_zone_forecast SET vr_year3 = "+tot+" WHERE commercial_zone = '"+commercial_zone+"' AND product_line = '"+product_line+"' AND year = "+year+" AND forecast = "+forecast+";";
		console.log(query);

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));


		});
	});
},

update_vr1_cc: function(req,res){
	var year = req.param('year');
  	var customer = req.param('customer');
  	var product_line = req.param('product_line');
  	
  	var tot = req.param('tot');

  	var forecast = req.param('forecast');

	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
		const query = "UPDATE "+schema+"total_zone_forecast_cc SET vr_year3 = "+tot+" WHERE customer_id = '"+customer+"' AND product_line = '"+product_line+"' AND year = "+year+" AND forecast = "+forecast+";";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));


		});
	});
},

put_budget_period_closed_by_zone_cc: function(req,res){
  	var customer = req.param('customer');
  	var year = req.param('year');
  	var product_line = req.param('product_line');
  	var ene = req.param('ene');
  		ene = ene.replace(/[,]/g,'');
  	var feb = req.param('feb');
  		feb = feb.replace(/[,]/g,'');
  	var mar = req.param('mar');
  		mar = mar.replace(/[,]/g,'');
  	var abr = req.param('abr');
  		abr = abr.replace(/[,]/g,'');
  	var may = req.param('may');
  		may = may.replace(/[,]/g,'');
  	var jun = req.param('jun');
  		jun = jun.replace(/[,]/g,'');
  	var jul = req.param('jul');
  		jul = jul.replace(/[,]/g,'');
  	var ago = req.param('ago');
  		ago = ago.replace(/[,]/g,'');
  	var sep = req.param('sep');
  		sep = sep.replace(/[,]/g,'');
  	var oct = req.param('oct');
  		oct = oct.replace(/[,]/g,'');
  	var nov = req.param('nov');
  		nov = nov.replace(/[,]/g,'');
  	var dic = req.param('dic');
  		dic = dic.replace(/[,]/g,'');

  	var tot = parseFloat(ene)+parseFloat(feb)+parseFloat(mar)+parseFloat(abr)+parseFloat(may)+parseFloat(jun)+parseFloat(jul)+parseFloat(ago)+parseFloat(sep)+parseFloat(oct)+parseFloat(nov)+parseFloat(dic);

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
		const query = "INSERT INTO "+schema+"budget_period_con_cc(YEAR, PRODUCT_LINE, PRODUCT_LINE_SUBFAMILY, SELLER, customer_id, TIENDA, ENE, FEB, MAR, ABR, MAY, JUN, JUL, AGO, SEP, OCT, NOV, DIC, TOT, STATUS) VALUES ('"+year+"','"+product_line+"','','','"+customer+"','','"+ene+"','"+feb+"','"+mar+"','"+abr+"','"+may+"','"+jun+"','"+jul+"','"+ago+"','"+sep+"','"+oct+"','"+nov+"','"+dic+"','"+tot+"','1')";
	  	
	  

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));


		});
	});
},

put_forecast_closed_by_zone_cc: function(req,res){
	var year = req.param('year');
  	var customer = req.param('customer');
  	var product_line = req.param('product_line');
  	var ene = req.param('ene');
  		ene = ene.replace(/[,]/g,'');
  	var feb = req.param('feb');
  		feb = feb.replace(/[,]/g,'');
  	var mar = req.param('mar');
  		mar = mar.replace(/[,]/g,'');
  	var abr = req.param('abr');
  		abr = abr.replace(/[,]/g,'');
  	var may = req.param('may');
  		may = may.replace(/[,]/g,'');
  	var jun = req.param('jun');
  		jun = jun.replace(/[,]/g,'');
  	var jul = req.param('jul');
  		jul = jul.replace(/[,]/g,'');
  	var ago = req.param('ago');
  		ago = ago.replace(/[,]/g,'');
  	var sep = req.param('sep');
  		sep = sep.replace(/[,]/g,'');
  	var oct = req.param('oct');
  		oct = oct.replace(/[,]/g,'');
  	var nov = req.param('nov');
  		nov = nov.replace(/[,]/g,'');
  	var dic = req.param('dic');
  		dic = dic.replace(/[,]/g,'');

  	var tot = parseFloat(ene)+parseFloat(feb)+parseFloat(mar)+parseFloat(abr)+parseFloat(may)+parseFloat(jun)+parseFloat(jul)+parseFloat(ago)+parseFloat(sep)+parseFloat(oct)+parseFloat(nov)+parseFloat(dic);

  	var forecast = req.param('forecast');
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
		const query = "INSERT INTO "+schema+"forecast_con_cc(YEAR, PRODUCT_LINE, PRODUCT_LINE_SUBFAMILY, SELLER, customer_id, TIENDA, ENE, FEB, MAR, ABR, MAY, JUN, JUL, AGO, SEP, OCT, NOV, DIC, TOT, STATUS, FORECAST) VALUES ('"+year+"','"+product_line+"','','','"+customer+"','',"+ene+","+feb+","+mar+","+abr+","+may+","+jun+","+jul+","+ago+","+sep+","+oct+","+nov+","+dic+","+tot+",1,"+forecast+")";
	  	
	    

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));


		});
	});
},

delete_budget_period_cc: function(req,res){
  	var customer = req.param('customer');
  	var year = req.param('year');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "DELETE FROM "+schema+"budget_period_con_cc WHERE customer_id = '"+customer+"' AND YEAR = '"+year+"'";
	  	

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify({status:200}));


		});
	});

},

delete_forecast_cc: function(req,res){
  	var customer = req.param('customer');
  	var year = req.param('year');
  	var forecast = req.param('forecast');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "DELETE FROM "+schema+"forecast_con_cc WHERE customer_id = '"+customer+"' AND YEAR = '"+year+"' AND FORECAST = '"+forecast+"'";
	  	

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify({status:200}));


		});
	});

},


delete_budget_period: function(req,res){
  	var commercial_zone = req.param('commercial_zone');
  	var year = req.param('year');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "DELETE FROM "+schema+"budget_period_con WHERE COMMERCIAL_ZONE = '"+commercial_zone+"' AND YEAR = '"+year+"'";
	  	

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify({status:200}));


		});
	});

},

delete_forecast: function(req,res){
  	var commercial_zone = req.param('commercial_zone');
  	var year = req.param('year');
  	var forecast = req.param('forecast');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "DELETE FROM "+schema+"forecast_con WHERE COMMERCIAL_ZONE = '"+commercial_zone+"' AND YEAR = '"+year+"' AND FORECAST = '"+forecast+"'";
	  	

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify({status:200}));


		});
	});

},

get_existing_apportionment_data_cc: function(req,res){
  	var customer = req.param('customer');
  	var year = req.param('year');
  	var product_line = req.param('product_line');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT product_line,ENE,FEB,MAR,ABR,MAY,JUN,JUL,AGO,SEP,OCT,NOV,DIC FROM "+schema+"apportionment_period_cc WHERE product_line = '"+product_line+"' AND customer_id = '"+customer+"' AND year = '"+year+"' ";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));


		});
	});
},

get_existing_forecast_apportionment_data_cc: function(req,res){
  	var customer = req.param('customer');
  	var year = req.param('year');
  	var product_line = req.param('product_line');
  	var forecast = req.param('forecast');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT product_line, ene, feb, mar, abr, may, jun, jul, ago, sep, oct, nov, dic FROM "+schema+"apportionment_forecast_period_cc WHERE product_line = '"+product_line+"' AND customer_id = '"+customer+"' AND year = '"+year+"' AND forecast = '"+forecast+"'";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));


		});
	});
},

get_existing_apportionment_data: function(req,res){
  	var commercial_zone = req.param('commercial_zone');
  	var year = req.param('year');
  	var product_line = req.param('product_line');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT product_line,ENE,FEB,MAR,ABR,MAY,JUN,JUL,AGO,SEP,OCT,NOV,DIC FROM "+schema+"apportionment_period WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = '"+year+"' ";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));


		});
	});

},

get_existing_forecast_apportionment_data: function(req,res){
  	var commercial_zone = req.param('commercial_zone');
  	var year = req.param('year');
  	var product_line = req.param('product_line');
  	var forecast = req.param('forecast');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT product_line,ENE,FEB,MAR,ABR,MAY,JUN,JUL,AGO,SEP,OCT,NOV,DIC FROM "+schema+"apportionment_forecast_period WHERE product_line = '"+product_line+"' AND commercial_zone = '"+commercial_zone+"' AND year = '"+year+"' AND forecast = '"+forecast+"' ";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));


		});
	});

},

check_if_exist_apportionment_cc: function(req,res){
  	var customer = req.param('customer');
  	var year = req.param('year');
  	
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT DISTINCT customer_id FROM "+schema+"apportionment_period_cc WHERE  customer_id = '"+customer+"' AND year = '"+year+"'";
	  	
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));


		});
	});
},

check_if_exist_forecast_apportionment_cc: function(req,res){
  	var customer = req.param('customer');
  	var year = req.param('year');
  	var forecast = req.param('forecast');
  	
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT DISTINCT customer_id FROM "+schema+"apportionment_forecast_period_cc WHERE  customer_id = '"+customer+"' AND year = '"+year+"' AND forecast = '"+forecast+"'";
	  	
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));


		});
	});
},

check_if_exist_apportionment: function(req,res){
  	var commercial_zone = req.param('commercial_zone');
  	var year = req.param('year');
  	
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT DISTINCT commercial_zone FROM "+schema+"apportionment_period WHERE commercial_zone = '"+commercial_zone+"' AND year = '"+year+"'";
	  	
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));


		});
	});
},

check_if_exist_forecast_apportionment: function(req,res){
  	var commercial_zone = req.param('commercial_zone');
  	var year = req.param('year');
  	var forecast = req.param('forecast');
  	
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT DISTINCT commercial_zone FROM "+schema+"apportionment_forecast_period WHERE commercial_zone = '"+commercial_zone+"' AND year = '"+year+"' AND FORECAST = '"+forecast+"'";
	  	
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));


		});
	});
},

put_apportionment_period_closed_by_zone: function(req,res){
  	var commercial_zone = req.param('commercial_zone');
  	var product_line = req.param('product_line');
  	var ene = req.param('ene');
  	var feb = req.param('feb');
  	var mar = req.param('mar');
  	var abr = req.param('abr');
  	var may = req.param('may');
  	var jun = req.param('jun');
  	var jul = req.param('jul');
  	var ago = req.param('ago');
  	var sep = req.param('sep');
  	var oct = req.param('oct');
  	var nov = req.param('nov');
  	var dic = req.param('dic');
  	var year = req.param('year');

  	var tot = parseFloat(ene)+parseFloat(feb)+parseFloat(mar)+parseFloat(abr)+parseFloat(may)+parseFloat(jun)+parseFloat(jul)+parseFloat(ago)+parseFloat(sep)+parseFloat(oct)+parseFloat(nov)+parseFloat(dic);


  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
		const query = "INSERT INTO "+schema+"apportionment_period (YEAR, commercial_zone, product_line, ENE, FEB, MAR, ABR, MAY, JUN, JUL, AGO, SEP, OCT, NOV, DIC, TOT, STATUS) VALUES ("+year+",'"+commercial_zone+"','"+product_line+"', "+ene+","+feb+","+mar+","+abr+","+may+","+jun+","+jul+","+ago+","+sep+","+oct+","+nov+","+dic+","+tot+",1)";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));


		});
	});
},

put_apportionment_forecast_period_closed_by_zone: function(req,res){
  	var commercial_zone = req.param('commercial_zone');
  	var product_line = req.param('product_line');
  	var ene = req.param('ene');
  	var feb = req.param('feb');
  	var mar = req.param('mar');
  	var abr = req.param('abr');
  	var may = req.param('may');
  	var jun = req.param('jun');
  	var jul = req.param('jul');
  	var ago = req.param('ago');
  	var sep = req.param('sep');
  	var oct = req.param('oct');
  	var nov = req.param('nov');
  	var dic = req.param('dic');
  	var year = req.param('year');

  	var tot = parseFloat(ene)+parseFloat(feb)+parseFloat(mar)+parseFloat(abr)+parseFloat(may)+parseFloat(jun)+parseFloat(jul)+parseFloat(ago)+parseFloat(sep)+parseFloat(oct)+parseFloat(nov)+parseFloat(dic);

  	var forecast = req.param('forecast');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
		const query = "INSERT INTO "+schema+"apportionment_forecast_period (YEAR, commercial_zone, product_line, ENE, FEB, MAR, ABR, MAY, JUN, JUL, AGO, SEP, OCT, NOV, DIC, TOT, STATUS, FORECAST) VALUES ("+year+",'"+commercial_zone+"','"+product_line+"', "+ene+","+feb+","+mar+","+abr+","+may+","+jun+","+jul+","+ago+","+sep+","+oct+","+nov+","+dic+","+tot+",1,"+forecast+")";

		
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));


		});
	});
},

put_apportionment_period_closed_by_zone_cc: function(req,res){
  	var product_line = req.param('product_line');
  	var ene = req.param('ene');
  	if (ene === '') {ene = 0;}
  	var feb = req.param('feb');
  	if (feb === '') {feb = 0;}
  	var mar = req.param('mar');
  	if (mar === '') {mar = 0;}
  	var abr = req.param('abr');
  	if (abr === '') {abr = 0;}
  	var may = req.param('may');
  	if (may === '') {may = 0;}
  	var jun = req.param('jun');
  	if (jun === '') {jun = 0;}
  	var jul = req.param('jul');
  	if (jul === '') {jul = 0;}
  	var ago = req.param('ago');
  	if (ago === '') {ago = 0;}
  	var sep = req.param('sep');
  	if (sep === '') {sep = 0;}
  	var oct = req.param('oct');
  	if (oct === '') {oct = 0;}
  	var nov = req.param('nov');
  	if (nov === '') {nov = 0;}
  	var dic = req.param('dic');
  	if (dic === '') {dic = 0;}
  	var year = req.param('year');
  	var customer = req.param('customer');
  	var forecast = req.param('forecast');

  	var tot = parseFloat(ene)+parseFloat(feb)+parseFloat(mar)+parseFloat(abr)+parseFloat(may)+parseFloat(jun)+parseFloat(jul)+parseFloat(ago)+parseFloat(sep)+parseFloat(oct)+parseFloat(nov)+parseFloat(dic);

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
		const query = "INSERT INTO "+schema+"apportionment_period_cc(year, product_line, customer_id, ene, feb, mar, abr, may, jun, jul, ago, sep, oct, nov, dic, tot, status) VALUES ("+year+", '"+product_line+"', '"+customer+"', "+ene+", "+feb+", "+mar+", "+abr+", "+may+", "+jun+", "+jul+", "+ago+", "+sep+", "+oct+", "+nov+", "+dic+", "+tot+", 1)";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));


		});
	});
},

put_apportionment_forecast_period_closed_by_zone_cc: function(req,res){
  	var product_line = req.param('product_line');
  	var ene = req.param('ene');
  	if (ene === '') {ene = 0;}
  	var feb = req.param('feb');
  	if (feb === '') {feb = 0;}
  	var mar = req.param('mar');
  	if (mar === '') {mar = 0;}
  	var abr = req.param('abr');
  	if (abr === '') {abr = 0;}
  	var may = req.param('may');
  	if (may === '') {may = 0;}
  	var jun = req.param('jun');
  	if (jun === '') {jun = 0;}
  	var jul = req.param('jul');
  	if (jul === '') {jul = 0;}
  	var ago = req.param('ago');
  	if (ago === '') {ago = 0;}
  	var sep = req.param('sep');
  	if (sep === '') {sep = 0;}
  	var oct = req.param('oct');
  	if (oct === '') {oct = 0;}
  	var nov = req.param('nov');
  	if (nov === '') {nov = 0;}
  	var dic = req.param('dic');
  	if (dic === '') {dic = 0;}
  	var year = req.param('year');
  	var customer = req.param('customer');
  	var forecast = req.param('forecast');

  	var tot = parseFloat(ene)+parseFloat(feb)+parseFloat(mar)+parseFloat(abr)+parseFloat(may)+parseFloat(jun)+parseFloat(jul)+parseFloat(ago)+parseFloat(sep)+parseFloat(oct)+parseFloat(nov)+parseFloat(dic);

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
		const query = "INSERT INTO "+schema+"apportionment_forecast_period_cc(year, product_line, customer_id, ene, feb, mar, abr, may, jun, jul, ago, sep, oct, nov, dic, tot, status, forecast) VALUES ("+year+", '"+product_line+"', '"+customer+"', "+ene+", "+feb+", "+mar+", "+abr+", "+may+", "+jun+", "+jul+", "+ago+", "+sep+", "+oct+", "+nov+", "+dic+", "+tot+", 1, "+forecast+")";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));


		});
	});
},

delete_apportionment_period_closed_by_zone_cc: function(req,res){
 	var year = req.param('year');
  	var customer = req.param('customer');


  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "DELETE FROM "+schema+"apportionment_period_cc WHERE customer_id = '"+customer+"' AND YEAR = '"+year+"'";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify({status:200}));


		});
	});
},

delete_forecast_apportionment_period_closed_by_zone_cc: function(req,res){
 	var year = req.param('year');
  	var customer = req.param('customer');
  	var forecast = req.param('forecast');


  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "DELETE FROM "+schema+"apportionment_forecast_period_cc WHERE customer_id = '"+customer+"' AND YEAR = '"+year+"' AND FORECAST = '"+forecast+"'";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify({status:200}));


		});
	});
},


delete_apportionment_period_closed_by_zone: function(req,res){
 	var year = req.param('year');
  	var commercial_zone = req.param('commercial_zone');


  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "DELETE FROM "+schema+"apportionment_period WHERE commercial_zone = '"+commercial_zone+"' AND YEAR = '"+year+"'";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify({status:200}));


		});
	});
},

delete_forecast_apportionment_period_closed_by_zone: function(req,res){
 	var year = req.param('year');
  	var commercial_zone = req.param('commercial_zone');
  	var forecast = req.param('forecast');


  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "DELETE FROM "+schema+"apportionment_forecast_period WHERE commercial_zone = '"+commercial_zone+"' AND YEAR = '"+year+"' AND FORECAST = '"+forecast+"'";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify({status:200}));


		});
	});
},


put_total_zone_budget_period : function(req,res){
  	var commercial_zone = req.param('commercial_zone');
  	var product_line = req.param('product_line');
  	var year = req.param('year');

  	if (year == '') {year=0};

  	var year1 = req.param('year1');
  		year1 = year1.replace(/,/g, '');
  		if (year1 == '') {year1=0};

  	var year2 = req.param('year2');
  		year2 = year2.replace(/,/g, '');
  		if (year2 == '') {year2=0};


  	var year3 = req.param('year3');
  		year3 = year3.replace(/,/g, '');
  		if (year3 == '') {year3=0};

  	var ext1 = req.param('ext1');
        ext1 = ext1.replace(/,/g, '');
        if (ext1 == '') {ext1=0};

    var boyear = req.param('boyear');
        boyear = boyear.replace(/,/g, '');
        if (boyear == '') {boyear=0};

    var cpo = req.param('cpo');
    	cpo = cpo.replace(/,/g, '');
    	if (cpo == '') {cpo=0};

  	var poyear = req.param('poyear');
  		poyear = poyear.replace(/,/g, '');
  		if (poyear == '') {poyear=0};

  	var povs = req.param('povs');
  		povs = povs.replace(/,/g, '');
  		if (povs == '') {povs=0};

  	var proyyear = req.param('proyyear');
  		proyyear = proyyear.replace(/,/g, '');
  		if (proyyear == '') {proyyear=0};

  	var totpyear = req.param('totpyear');
  		totpyear = totpyear.replace(/,/g, '');
  		if (totpyear == '') {totpyear=0};

  	var povsyear = req.param('povsyear');
  		povsyear = povsyear.replace(/,/g, '');
  		if (povsyear == '') {povsyear=0};

  	var difyear = req.param('difyear');
  		difyear = difyear.replace(/,/g, '');
  		if (difyear == '') {difyear=0};

  	var partyear = req.param('partyear');
  		partyear = partyear.replace(/,/g, '');
  		if (partyear == '') {partyear=0};


  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
		const query = "INSERT INTO "+schema+"total_zone_budget_period(year, commercial_zone, product_line, vr_year1, vr_year2, vr_year3, extraord, boyear, cpo, poyear, povs, proyyear, totpyear, povsyear, difyear, partyear) VALUES ("+year+",'"+commercial_zone+"','"+product_line+"', "+year1+","+year2+","+year3+","+ext1+","+boyear+","+cpo+","+poyear+","+povs+","+proyyear+","+totpyear+","+povsyear+","+difyear+","+partyear+")";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));


		});
	});
},

put_total_zone_forecast : function(req,res){
  	var commercial_zone = req.param('commercial_zone');
  	var product_line = req.param('product_line');
  	var year = req.param('year');

  	if (year == '') {year=0};

  	var year1 = req.param('year1');
  		year1 = year1.replace(/,/g, '');
  		if (year1 == '') {year1=0};

  	var year2 = req.param('year2');
  		year2 = year2.replace(/,/g, '');
  		if (year2 == '') {year2=0};


  	var year3 = req.param('year3');
  		year3 = year3.replace(/,/g, '');
  		if (year3 == '') {year3=0};

  	var ext1 = req.param('ext1');
        ext1 = ext1.replace(/,/g, '');
        if (ext1 == '') {ext1=0};

    var boyear = req.param('boyear');
        boyear = boyear.replace(/,/g, '');
        if (boyear == '') {boyear=0};

    var cpo = req.param('cpo');
    	cpo = cpo.replace(/,/g, '');
    	if (cpo == '') {cpo=0};

  	var poyear = req.param('poyear');
  		poyear = poyear.replace(/,/g, '');
  		if (poyear == '') {poyear=0};

  	var povs = req.param('povs');
  		povs = povs.replace(/,/g, '');
  		if (povs == '') {povs=0};

  	var proyyear = req.param('proyyear');
  		proyyear = proyyear.replace(/,/g, '');
  		if (proyyear == '') {proyyear=0};

  	var totpyear = req.param('totpyear');
  		totpyear = totpyear.replace(/,/g, '');
  		if (totpyear == '') {totpyear=0};

  	var povsyear = req.param('povsyear');
  		povsyear = povsyear.replace(/,/g, '');
  		if (povsyear == '') {povsyear=0};

  	var difyear = req.param('difyear');
  		difyear = difyear.replace(/,/g, '');
  		if (difyear == '') {difyear=0};

  	var partyear = req.param('partyear');
  		partyear = partyear.replace(/,/g, '');
  		if (partyear == '') {partyear=0};

  	var forecast = req.param('forecast');


  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
		const query = "INSERT INTO "+schema+"total_zone_forecast( year, commercial_zone, product_line, vr_year1, vr_year2, vr_year3, extraord, boyear, cpo, poyear, povs, proyyear, totpyear, povsyear, difyear, partyear, forecast) VALUES ( "+year+", '"+commercial_zone+"', '"+product_line+"', "+year1+", "+year2+", "+year3+", "+ext1+", "+boyear+", "+cpo+", "+poyear+", "+povs+", "+proyyear+", "+totpyear+", "+povsyear+", "+difyear+", "+partyear+", "+forecast+")";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));


		});
	});
},


put_total_zone_budget_period_cc : function(req,res){
  	var customer = req.param('customer');

  	var product_line = req.param('product_line');
  	var year = req.param('year');
  	if (year == '') {year=0};

  	var year1 = req.param('year1');
  		year1 = year1.replace(/,/g, '');
  		if (year1 == '') {year1=0};

  	var year2 = req.param('year2');
  		year2 = year2.replace(/,/g, '');
  		if (year2 == '') {year2=0};


  	var year3 = req.param('year3');
  		year3 = year3.replace(/,/g, '');
  		if (year3 == '') {year3=0};

  	var ext1 = req.param('ext1');
        ext1 = ext1.replace(/,/g, '');
        if (ext1 == '') {ext1=0};

    var boyear = req.param('boyear');
        boyear = boyear.replace(/,/g, '');
        if (boyear == '') {boyear=0};

    var cpo = req.param('cpo');
    	cpo = cpo.replace(/,/g, '');
    	if (cpo == '') {cpo=0};

  	var poyear = req.param('poyear');
  		poyear = poyear.replace(/,/g, '');
  		if (poyear == '') {poyear=0};

  	var povs = req.param('povs');
  		povs = povs.replace(/,/g, '');
  		if (povs == '') {povs=0};

  	var proyyear = req.param('proyyear');
  		proyyear = proyyear.replace(/,/g, '');
  		if (proyyear == '') {proyyear=0};

  	var totpyear = req.param('totpyear');
  		totpyear = totpyear.replace(/,/g, '');
  		if (totpyear == '') {totpyear=0};

  	var povsyear = req.param('povsyear');
  		povsyear = povsyear.replace(/,/g, '');
  		if (povsyear == '') {povsyear=0};

  	var difyear = req.param('difyear');
  		difyear = difyear.replace(/,/g, '');
  		if (difyear == '') {difyear=0};

  	var partyear = req.param('partyear');
  		partyear = partyear.replace(/,/g, '');
  		if (partyear == '') {partyear=0};

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
		const query = "INSERT INTO "+schema+"total_zone_budget_period_cc(customer_id, year, product_line, vr_year1, vr_year2, vr_year3, extraord, boyear, cpo, poyear, povs, proyyear, totpyear, povsyear, difyear, partyear) VALUES ("+customer+", "+year+", '"+product_line+"', "+year1+", "+year2+", "+year3+", "+ext1+", "+boyear+", "+cpo+", "+poyear+", "+povs+", "+proyyear+", "+totpyear+", "+povsyear+", "+difyear+", "+partyear+")";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));


		});
	});
},

put_total_zone_forecast_cc : function(req,res){
  	var customer = req.param('customer');

  	var product_line = req.param('product_line');
  	var year = req.param('year');
  	if (year == '') {year=0};

  	var year1 = req.param('year1');
  		year1 = year1.replace(/,/g, '');
  		if (year1 == '') {year1=0};

  	var year2 = req.param('year2');
  		year2 = year2.replace(/,/g, '');
  		if (year2 == '') {year2=0};


  	var year3 = req.param('year3');
  		year3 = year3.replace(/,/g, '');
  		if (year3 == '') {year3=0};

  	var ext1 = req.param('ext1');
        ext1 = ext1.replace(/,/g, '');
        if (ext1 == '') {ext1=0};

    var boyear = req.param('boyear');
        boyear = boyear.replace(/,/g, '');
        if (boyear == '') {boyear=0};

    var cpo = req.param('cpo');
    	cpo = cpo.replace(/,/g, '');
    	if (cpo == '') {cpo=0};

  	var poyear = req.param('poyear');
  		poyear = poyear.replace(/,/g, '');
  		if (poyear == '') {poyear=0};

  	var povs = req.param('povs');
  		povs = povs.replace(/,/g, '');
  		if (povs == '') {povs=0};

  	var proyyear = req.param('proyyear');
  		proyyear = proyyear.replace(/,/g, '');
  		if (proyyear == '') {proyyear=0};

  	var totpyear = req.param('totpyear');
  		totpyear = totpyear.replace(/,/g, '');
  		if (totpyear == '') {totpyear=0};

  	var povsyear = req.param('povsyear');
  		povsyear = povsyear.replace(/,/g, '');
  		if (povsyear == '') {povsyear=0};

  	var difyear = req.param('difyear');
  		difyear = difyear.replace(/,/g, '');
  		if (difyear == '') {difyear=0};

  	var partyear = req.param('partyear');
  		partyear = partyear.replace(/,/g, '');
  		if (partyear == '') {partyear=0};

  	var forecast = req.param('forecast');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
		const query = "INSERT INTO "+schema+"total_zone_forecast_cc(customer_id, year, product_line, vr_year1, vr_year2, vr_year3, extraord, boyear, cpo, poyear, povs, proyyear, totpyear, povsyear, difyear, partyear, forecast) VALUES ("+customer+", "+year+", '"+product_line+"', "+year1+", "+year2+", "+year3+", "+ext1+", "+boyear+", "+cpo+", "+poyear+", "+povs+", "+proyyear+", "+totpyear+", "+povsyear+", "+difyear+", "+partyear+", "+forecast+")";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));


		});
	});
},

delete_total_zone_budget_period_cc : function(req,res){
  	var customer_id = req.param('customer');
  	var year = req.param('year');
  	
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "DELETE FROM "+schema+"total_zone_budget_period_cc WHERE customer_id = '"+customer_id+"' AND YEAR = '"+year+"'";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify({status:200}));

		});
	});
},

delete_total_zone_forecast_cc : function(req,res){
  	var customer_id = req.param('customer');
  	var year = req.param('year');
  	var forecast = req.param('forecast');
  	
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "DELETE FROM "+schema+"total_zone_forecast_cc WHERE customer_id = '"+customer_id+"' AND YEAR = '"+year+"' AND forecast = '"+forecast+"'";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify({status:200}));

		});
	});
},

delete_total_zone_budget_period : function(req,res){
  	var commercial_zone = req.param('commercial_zone');
  	var year = req.param('year');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "DELETE FROM "+schema+"total_zone_budget_period WHERE commercial_zone = '"+commercial_zone+"' AND YEAR = '"+year+"'";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify({status:200}));

		});
	});
},

delete_total_zone_forecast : function(req,res){
  	var commercial_zone = req.param('commercial_zone');
  	var year = req.param('year');
  	var forecast = req.param('forecast');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "DELETE FROM "+schema+"total_zone_forecast WHERE commercial_zone = '"+commercial_zone+"' AND YEAR = '"+year+"' AND FORECAST = '"+forecast+"'";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify({status:200}));

		});
	});
},


delete_budget_next_year_cc : function(req,res){
  	var customer_id = req.param('customer');
  	var year = req.param('year');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "DELETE FROM "+schema+"budget_next_year_cc WHERE customer_id = '"+customer_id+"' AND YEAR = '"+year+"'";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify({status:200}));

		});
	});
},

delete_budget_next_year : function(req,res){
  	var commercial_zone = req.param('commercial_zone');
  	var year = req.param('year');
  	var non_cc = req.param('non_cc');
  	
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "DELETE FROM "+schema+"budget_next_year_cc WHERE commercial_zone = '"+commercial_zone+"' AND YEAR = '"+year+"' AND customer_id IN ("+non_cc+")";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify({status:200}));

		});
	});
},

delete_forecast_next_year : function(req,res){
  	var commercial_zone = req.param('commercial_zone');
  	var year = req.param('year');
  	var non_cc = req.param('non_cc');
  	var forecast = req.param('forecast');
  	
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "DELETE FROM "+schema+"forecast_next_year WHERE commercial_zone = '"+commercial_zone+"' AND year = '"+year+"' AND forecast = '"+forecast+"' AND customer_id IN( "+non_cc+")";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify({status:200}));

		});
	});
},



put_forecast_next_year : function(req,res){
  	var commercial_zone = req.param('commercial_zone');
  	var year = req.param('year');
  	var non_cc = req.param('non_cc');
  	var forecast = req.param('forecast');

  	console.log(non_cc);

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "INSERT INTO "+schema+"forecast_next_year( year, month, commercial_zone, customer_id, customer, tienda, tienda_desc, tienda_status, seller_number, seller_name, product_line, last_year_budget, annual_growth_percentage, annual_growth_m2, forecast) SELECT a.year, a.month, a.commercial_zone, a.customer_id, ( SELECT c.customer FROM "+schema+"customers c WHERE c.customer_id = a.customer_id) AS customer, '', '', '1', a.seller, a.seller_name, a.product_line AS pl, a.m2 AS m2, d.povs AS per, (a.m2 * ((d.povs/100)+1)) AS annual_growth_m2, "+forecast+" FROM "+schema+"budget_period_group a JOIN "+schema+"total_zone_forecast d ON a.year = d.year AND a.commercial_zone = '"+commercial_zone+"' AND a.product_line = d.product_line WHERE a.year = "+year+" AND customer_id IN ("+non_cc+")";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
},

put_budget_next_year : function(req,res){
  	var commercial_zone = req.param('commercial_zone');
  	var year = req.param('year');
  	var non_cc = req.param('non_cc');
  	var forecast = req.param('forecast');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	//const query = "INSERT INTO "+schema+"budget_next_year_cc(year, month, commercial_zone, customer_id, tienda, seller_number, product_line, last_year_budget, annual_growth_percentage, annual_growth_m2) SELECT year,month,commercial_zone,customer_id,tienda,seller,product_line as pl, m2 as m2, (SELECT povs FROM "+schema+"total_zone_budget_period_cc WHERE year = "+year+" AND customer_id = "+customer_id+" AND product_line = pl) as per, (m2*(((SELECT povs FROM "+schema+"total_zone_budget_period_cc WHERE year = "+year+" AND customer_id = "+customer_id+" AND product_line = pl)/100)+1)) as annual_growth_m2 FROM "+schema+"budget_period_group WHERE year = "+year+" AND customer_id = "+customer_id+"";
	  	//const query = "INSERT INTO "+schema+"budget_next_year_cc(year, month, commercial_zone, customer_id, customer, tienda, tienda_desc, tienda_status, seller_number, seller_name, product_line, last_year_budget, annual_growth_percentage, annual_growth_m2) SELECT year,month,commercial_zone,customer_id,(SELECT customer FROM "+schema+"customers WHERE customer_id = "+customer_id+"),tienda as st,(SELECT tienda_desc FROM "+schema+"historical_stores_cc WHERE tienda = st), (SELECT status FROM "+schema+"historical_stores_cc WHERE tienda = st), seller,seller_name,product_line as pl, m2 as m2, (SELECT povs FROM "+schema+"total_zone_budget_period_cc WHERE year = "+year+" AND customer_id = "+customer_id+" AND product_line = pl) as per, (m2*(((SELECT povs FROM "+schema+"total_zone_budget_period_cc WHERE year = "+year+" AND customer_id = "+customer_id+" AND product_line = pl)/100)+1)) as annual_growth_m2 FROM "+schema+"budget_period_group WHERE year = "+year+" AND customer_id = "+customer_id+"";
	  	//const query = "INSERT INTO "+schema+"budget_next_year_cc(year, month, commercial_zone, customer_id, customer, tienda, tienda_desc, tienda_status, seller_number, seller_name, product_line, last_year_budget, annual_growth_percentage, annual_growth_m2) SELECT year, month, commercial_zone, customer_id,(SELECT customer FROM "+schema+"customers WHERE customer_id = "+customer_id+"), tienda as st, (SELECT tienda_desc FROM "+schema+"historical_stores_cc WHERE tienda = (SELECT tienda FROM "+schema+"budget_period_group WHERE year = "+year+" AND customer_id = "+customer_id+")), (SELECT status FROM "+schema+"historical_stores_cc WHERE tienda = (SELECT tienda FROM "+schema+"budget_period_group WHERE year = "+year+" AND customer_id = "+customer_id+")), seller, seller_name, product_line as pl, m2 as m2, (SELECT povs FROM "+schema+"total_zone_budget_period_cc WHERE year = "+year+" AND customer_id = "+customer_id+" AND product_line = (SELECT product_line FROM "+schema+"budget_period_group WHERE year = "+year+" AND customer_id = "+customer_id+")) as per, ((SELECT m2 FROM "+schema+"budget_period_group WHERE year = "+year+" AND customer_id = "+customer_id+")*(((SELECT povs FROM "+schema+"total_zone_budget_period_cc WHERE year = "+year+" AND customer_id = "+customer_id+" AND product_line = (SELECT product_line FROM "+schema+"budget_period_group WHERE year = "+year+" AND customer_id = "+customer_id+"))/100)+1)) as annual_growth_m2 FROM "+schema+"budget_period_group WHERE year = "+year+" AND customer_id = "+customer_id+"";
	  	//const query = "INSERT INTO "+schema+"budget_next_year_cc( year, month, commercial_zone, customer_id, customer, tienda, tienda_desc, tienda_status, seller_number, seller_name, product_line, last_year_budget, annual_growth_percentage, annual_growth_m2) SELECT A.year, A.month, A.commercial_zone, A.customer_id, a.customer, '', '', '1', A.seller, A.seller_name, A.product_line as pl, A.m2 as m2, D.povs as per, (A.m2 * ((D.povs/100)+1)) as annual_growth_m2 FROM "+schema+"budget_period_group A JOIN "+schema+"total_zone_forecast D ON A.year = D.year AND A.commercial_zone = '"+commercial_zone+"' AND A.product_line = D.product_line WHERE A.year = "+year+" AND A.customer_type_id = 1";
	  	const query = "INSERT INTO "+schema+"budget_next_year_cc( year, month, commercial_zone, customer_id, customer, tienda, tienda_desc, tienda_status, seller_number, seller_name, product_line, last_year_budget, annual_growth_percentage, annual_growth_m2) SELECT a.year, a.month, a.commercial_zone, a.customer_id, a.customer, '', '', '1', a.seller, a.seller_name, a.product_line AS pl, a.m2 AS m2, d.povs AS per, (a.m2 * ((d.povs/100)+1)) AS annual_growth_m2 FROM "+schema+"budget_period_group a JOIN "+schema+"total_zone_forecast d ON a.year = d.year AND a.commercial_zone = '"+commercial_zone+"' AND a.product_line = d.product_line WHERE a.year = "+year+" AND a.customer_type_id = 1 AND a.commercial_zone = '"+commercial_zone+"' AND d.forecast = '"+forecast+"'";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
},


put_budget_next_year_cc : function(req,res){
  	var customer_id = req.param('customer');
  	var year = req.param('year');
  	var forecast = req.param('forecast');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	//const query = "INSERT INTO "+schema+"budget_next_year_cc(year, month, commercial_zone, customer_id, tienda, seller_number, product_line, last_year_budget, annual_growth_percentage, annual_growth_m2) SELECT year,month,commercial_zone,customer_id,tienda,seller,product_line as pl, m2 as m2, (SELECT povs FROM "+schema+"total_zone_budget_period_cc WHERE year = "+year+" AND customer_id = "+customer_id+" AND product_line = pl) as per, (m2*(((SELECT povs FROM "+schema+"total_zone_budget_period_cc WHERE year = "+year+" AND customer_id = "+customer_id+" AND product_line = pl)/100)+1)) as annual_growth_m2 FROM "+schema+"budget_period_group WHERE year = "+year+" AND customer_id = "+customer_id+"";
	  	//const query = "INSERT INTO "+schema+"budget_next_year_cc(year, month, commercial_zone, customer_id, customer, tienda, tienda_desc, tienda_status, seller_number, seller_name, product_line, last_year_budget, annual_growth_percentage, annual_growth_m2) SELECT year,month,commercial_zone,customer_id,(SELECT customer FROM "+schema+"customers WHERE customer_id = "+customer_id+"),tienda as st,(SELECT tienda_desc FROM "+schema+"historical_stores_cc WHERE tienda = st), (SELECT status FROM "+schema+"historical_stores_cc WHERE tienda = st), seller,seller_name,product_line as pl, m2 as m2, (SELECT povs FROM "+schema+"total_zone_budget_period_cc WHERE year = "+year+" AND customer_id = "+customer_id+" AND product_line = pl) as per, (m2*(((SELECT povs FROM "+schema+"total_zone_budget_period_cc WHERE year = "+year+" AND customer_id = "+customer_id+" AND product_line = pl)/100)+1)) as annual_growth_m2 FROM "+schema+"budget_period_group WHERE year = "+year+" AND customer_id = "+customer_id+"";
	  	//const query = "INSERT INTO "+schema+"budget_next_year_cc( year, month, commercial_zone, customer_id, customer, tienda, tienda_desc, tienda_status, seller_number, seller_name, product_line, last_year_budget, annual_growth_percentage, annual_growth_m2) SELECT year, month, commercial_zone, customer_id,(SELECT customer FROM "+schema+"customers WHERE customer_id = "+customer_id+"), tienda as st, 0, 0, seller, seller_name, product_line as pl, m2 as m2, 0, 0 FROM "+schema+"budget_period_group WHERE year = "+year+" AND customer_id = "+customer_id+"";
	  	const query = "INSERT INTO "+schema+"budget_next_year_cc( year, month, commercial_zone, customer_id, customer, tienda, tienda_desc, tienda_status, seller_number, seller_name, product_line, last_year_budget, annual_growth_percentage, annual_growth_m2) SELECT A.year, A.month, A.commercial_zone, A.customer_id,(SELECT C.customer FROM "+schema+"customers C WHERE C.customer_id = '"+customer_id+"') as customer, A.tienda as st, B.tienda_desc as tienda_desc, B.status as tienda_status, A.seller, A.seller_name, A.product_line as pl, A.m2 as m2, D.povs as per, (A.m2 * ((D.povs/100)+1)) as annual_growth_m2 FROM "+schema+"budget_period_group A JOIN "+schema+"historical_stores_cc B ON A.tienda = B.tienda JOIN "+schema+"total_zone_forecast_cc D ON A.year = D.year AND A.customer_id = D.customer_id AND A.product_line = D.product_line WHERE A.year = "+year+" AND A.customer_id = '"+customer_id+"' AND d.forecast = '"+forecast+"'";
	  	
	  	
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify({status:200}));

		});
	});
},

get_budget_next_year_cc : function(req,res){
  	var customer_id = req.param('customer');
  	var year = req.param('year');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT bny_pk, tienda, product_line, last_year_budget FROM "+schema+"budget_next_year_cc WHERE year = "+year+" AND customer_id = "+customer_id+"";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
},




update_budget_next_year_cc : function(req,res){
	var customer_id = req.param('customer');
	var year = req.param('year');
	var bny_pk = req.param('bny_pk');
	var tienda = req.param('tienda');
	var product_line = req.param('product_line');
	var last_year_budget = req.param('last_year_budget');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "UPDATE "+schema+"budget_next_year_cc SET tienda_desc =(SELECT tienda_desc FROM "+schema+"historical_stores_cc WHERE tienda = '"+tienda+"'), tienda_status = (SELECT status FROM "+schema+"historical_stores_cc WHERE tienda = '"+tienda+"'), annual_growth_percentage = (SELECT povs FROM "+schema+"total_zone_budget_period_cc WHERE year = "+year+" AND customer_id = "+customer_id+" AND product_line = '"+product_line+"'), annual_growth_m2 = ('"+last_year_budget+"'*(((SELECT povs FROM "+schema+"total_zone_budget_period_cc WHERE year = "+year+" AND customer_id = "+customer_id+" AND product_line = '"+product_line+"')/100)+1)) WHERE bny_pk = "+bny_pk+"";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify({result:200}));

		});
	});
},

select_non_cc: function(req,res){
  	
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT customer_id FROM "+schema+"customers WHERE customer_type_id != 2";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
},



put_p4_data_cc : function(req,res){
  	var year = req.param('year');
  	var customer_id = req.param('customer_id');
  	var customer = req.param('customer');

  	var seller_number = req.param('seller_number');
  	var seller_name = req.param('seller_name');
  	var product_line = req.param('product_line');

  	var ene = parseFloat(req.param('ene').replace(/,/, '')) || 0;
  	var feb = parseFloat(req.param('feb').replace(/,/, ''))  || 0;
  	var mar = parseFloat(req.param('mar').replace(/,/, ''))  || 0;
  	var abr = parseFloat(req.param('abr').replace(/,/, ''))  || 0;
  	var may = parseFloat(req.param('may').replace(/,/, ''))  || 0;
  	var jun = parseFloat(req.param('jun').replace(/,/, ''))  || 0;
  	var jul = parseFloat(req.param('jul').replace(/,/, ''))  || 0;
  	var ago = parseFloat(req.param('ago').replace(/,/, ''))  || 0;
  	var sep = parseFloat(req.param('sep').replace(/,/, ''))  || 0;
  	var oct = parseFloat(req.param('oct').replace(/,/, ''))  || 0;
  	var nov = parseFloat(req.param('nov').replace(/,/, ''))  || 0;
  	var dic = parseFloat(req.param('dic').replace(/,/, ''))  || 0;
  	var porcentaje = parseFloat(req.param('porcentaje').replace(/,/, ''))  || 0;
  	var total = parseFloat(req.param('total').replace(/,/, ''))  || 0;

  	
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "INSERT INTO "+schema+"seller_by_line_cc(year, customer_id, customer, seller_number, seller_name, product_line, ene, feb, mar, abr, may, jun, jul, ago, sep, oct, nov, dic, total, porcentaje) VALUES ('"+year+"','"+customer_id+"','"+customer+"','"+seller_number+"','"+seller_name+"','"+product_line+"',"+ene+","+feb+","+mar+","+abr+","+may+","+jun+","+jul+","+ago+","+sep+","+oct+","+nov+","+dic+","+total+","+porcentaje+")";
	  	


	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});

},

put_p4_data : function(req,res){
  	var year = req.param('year');
  	var commercial_zone = req.param('commercial_zone');

  	var seller_number = req.param('seller_number');
  	var seller_name = req.param('seller_name');
  	var product_line = req.param('product_line');
  

  	var ene = parseFloat(req.param('ene').replace(/,/, '')) || 0;
  	var feb = parseFloat(req.param('feb').replace(/,/, ''))  || 0;
  	var mar = parseFloat(req.param('mar').replace(/,/, ''))  || 0;
  	var abr = parseFloat(req.param('abr').replace(/,/, ''))  || 0;
  	var may = parseFloat(req.param('may').replace(/,/, ''))  || 0;
  	var jun = parseFloat(req.param('jun').replace(/,/, ''))  || 0;
  	var jul = parseFloat(req.param('jul').replace(/,/, ''))  || 0;
  	var ago = parseFloat(req.param('ago').replace(/,/, ''))  || 0;
  	var sep = parseFloat(req.param('sep').replace(/,/, ''))  || 0;
  	var oct = parseFloat(req.param('oct').replace(/,/, ''))  || 0;
  	var nov = parseFloat(req.param('nov').replace(/,/, ''))  || 0;
  	var dic = parseFloat(req.param('dic').replace(/,/, ''))  || 0;
  	var porcentaje = parseFloat(req.param('porcentaje').replace(/,/, ''))  || 0;
  	var total = parseFloat(req.param('total').replace(/,/, ''))  || 0;


  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "INSERT INTO "+schema+"seller_by_line(year, commercial_zone, seller_number, seller_name, product_line, ene, feb, mar, abr, may, jun, jul, ago, sep, oct, nov, dic, total, porcentaje) VALUES ("+year+",'"+commercial_zone+"',"+seller_number+",'"+seller_name+"','"+product_line+"',"+ene+","+feb+","+mar+","+abr+","+may+","+jun+","+jul+","+ago+","+sep+","+oct+","+nov+","+dic+","+total+","+porcentaje+")";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});


},

put_p4_forecast_data : function(req,res){
  	var year = req.param('year');
  	var commercial_zone = req.param('commercial_zone');
  	var forecast = req.param('forecast');

  	var seller_number = req.param('seller_number');
  	var seller_name = req.param('seller_name');
  	var product_line = req.param('product_line');
  	var ene = req.param('ene');
  	var feb = req.param('feb');
  	var mar = req.param('mar');
  	var abr = req.param('abr');
  	var may = req.param('may');
  	var jun = req.param('jun');
  	var jul = req.param('jul');
  	var ago = req.param('ago');
  	var sep = req.param('sep');
  	var oct = req.param('oct');
  	var nov = req.param('nov');
  	var dic = req.param('dic');
  	var total = req.param('total');

  	var ene = parseFloat(req.param('ene').replace(/,/, '')) || 0;
  	var feb = parseFloat(req.param('feb').replace(/,/, ''))  || 0;
  	var mar = parseFloat(req.param('mar').replace(/,/, ''))  || 0;
  	var abr = parseFloat(req.param('abr').replace(/,/, ''))  || 0;
  	var may = parseFloat(req.param('may').replace(/,/, ''))  || 0;
  	var jun = parseFloat(req.param('jun').replace(/,/, ''))  || 0;
  	var jul = parseFloat(req.param('jul').replace(/,/, ''))  || 0;
  	var ago = parseFloat(req.param('ago').replace(/,/, ''))  || 0;
  	var sep = parseFloat(req.param('sep').replace(/,/, ''))  || 0;
  	var oct = parseFloat(req.param('oct').replace(/,/, ''))  || 0;
  	var nov = parseFloat(req.param('nov').replace(/,/, ''))  || 0;
  	var dic = parseFloat(req.param('dic').replace(/,/, ''))  || 0;
  	var total = parseFloat(req.param('total').replace(/,/, ''))  || 0;


  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "INSERT INTO "+schema+"seller_by_line_forecast(year, commercial_zone, seller_number, seller_name, product_line, ene, feb, mar, abr, may, jun, jul, ago, sep, oct, nov, dic, total, forecast) VALUES ("+year+", '"+commercial_zone+"', "+seller_number+", '"+seller_name+"', '"+product_line+"', "+ene+", "+feb+", "+mar+", "+abr+", "+may+", "+jun+", "+jul+", "+ago+", "+sep+", "+oct+", "+nov+", "+dic+", "+total+", "+forecast+")";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});


},

put_p5_data_cc : function(req,res){
  	var periodo = req.param('periodo');
  	var unidad_de_negocio = req.param('unidad_de_negocio');
  	var zona = req.param('zona');
  	var presupuesto = req.param('presupuesto');
  	var clave_linea = req.param('clave_linea');
  	var desc_linea = req.param('desc_linea');
  	var clave_vendedor = req.param('clave_vendedor');
  	var desc_vendedor = req.param('desc_vendedor');
  	var cliente = req.param('cliente');
  	var desc_cliente = req.param('desc_cliente');
  	var tienda = req.param('tienda');
  	var ene = parseFloat(req.param('ene').replace(/,/, '')) || 0;
  	var feb = parseFloat(req.param('feb').replace(/,/, ''))  || 0;
  	var mar = parseFloat(req.param('mar').replace(/,/, ''))  || 0;
  	var abr = parseFloat(req.param('abr').replace(/,/, ''))  || 0;
  	var may = parseFloat(req.param('may').replace(/,/, ''))  || 0;
  	var jun = parseFloat(req.param('jun').replace(/,/, ''))  || 0;
  	var jul = parseFloat(req.param('jul').replace(/,/, ''))  || 0;
  	var ago = parseFloat(req.param('ago').replace(/,/, ''))  || 0;
  	var sep = parseFloat(req.param('sep').replace(/,/, ''))  || 0;
  	var oct = parseFloat(req.param('oct').replace(/,/, ''))  || 0;
  	var nov = parseFloat(req.param('nov').replace(/,/, ''))  || 0;
  	var dic = parseFloat(req.param('dic').replace(/,/, ''))  || 0;
  	var total = parseFloat(req.param('total').replace(/,/, ''))  || 0;

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SET ANSI_WARNINGS  OFF;INSERT INTO "+schema+"entregable_cc(periodo, unidad_de_negocio, zona, presupuesto, clave_linea, desc_linea, clave_vendedor, desc_vendedor, cliente, desc_cliente, tienda, ene, feb, mar, abr, may, jun, jul, ago, sep, oct, nov, dic, total) VALUES('"+periodo+"','"+unidad_de_negocio+"','"+zona+"','"+presupuesto+"','"+clave_linea+"','"+desc_linea+"','"+clave_vendedor+"','"+desc_vendedor+"','"+cliente+"','"+desc_cliente+"','"+tienda+"','"+ene+"','"+feb+"','"+mar+"','"+abr+"','"+may+"','"+jun+"','"+jul+"','"+ago+"','"+sep+"','"+oct+"','"+nov+"','"+dic+"','"+total+"')SET ANSI_WARNINGS ON;";
	  	//const query = "INSERT INTO "+schema+"entregable(periodo, unidad_de_negocio, zona, presupuesto, clave_linea, desc_linea, clave_vendedor, desc_vendedor, cliente, desc_cliente, tienda, ene, feb, mar, abr, may, jun, jul, ago, sep, oct, nov, dic) VALUES ('"+periodo+"', '"+unidad_de_negocio+"', '"+zona+"', '"+presupuesto+"', '"+clave_linea+"', '"+desc_linea+"', '"+clave_vendedor+"', '"+desc_vendedor+"', '"+cliente+"', '"+desc_cliente+"', '"+tienda+"', (('"+ene+"'/100) * (SELECT ENE FROM "+schema+"budget_period_con_cc WHERE customer_id = '"+cliente+"' AND YEAR = '"+periodo+"' AND PRODUCT_LINE = '"+desc_linea+"'))*((SELECT cpo FROM "+schema+"total_zone_budget_period_cc WHERE customer_id = '"+cliente+"' AND year = '"+periodo+"' AND product_line = '"+desc_linea+"')/100), (('"+feb+"'/100) * (SELECT FEB FROM "+schema+"budget_period_con_cc WHERE customer_id = '"+cliente+"' AND YEAR = '"+periodo+"' AND PRODUCT_LINE = '"+desc_linea+"'))*((SELECT cpo FROM "+schema+"total_zone_budget_period_cc WHERE customer_id = '"+cliente+"' AND year = '"+periodo+"' AND product_line = '"+desc_linea+"')/100), (('"+mar+"'/100) * (SELECT MAR FROM "+schema+"budget_period_con_cc WHERE customer_id = '"+cliente+"' AND YEAR = '"+periodo+"' AND PRODUCT_LINE = '"+desc_linea+"'))*((SELECT cpo FROM "+schema+"total_zone_budget_period_cc WHERE customer_id = '"+cliente+"' AND year = '"+periodo+"' AND product_line = '"+desc_linea+"')/100), (('"+abr+"'/100) * (SELECT ABR FROM "+schema+"budget_period_con_cc WHERE customer_id = '"+cliente+"' AND YEAR = '"+periodo+"' AND PRODUCT_LINE = '"+desc_linea+"'))*((SELECT cpo FROM "+schema+"total_zone_budget_period_cc WHERE customer_id = '"+cliente+"' AND year = '"+periodo+"' AND product_line = '"+desc_linea+"')/100), (('"+may+"'/100) * (SELECT MAY FROM "+schema+"budget_period_con_cc WHERE customer_id = '"+cliente+"' AND YEAR = '"+periodo+"' AND PRODUCT_LINE = '"+desc_linea+"'))*((SELECT cpo FROM "+schema+"total_zone_budget_period_cc WHERE customer_id = '"+cliente+"' AND year = '"+periodo+"' AND product_line = '"+desc_linea+"')/100), (('"+jun+"'/100) * (SELECT JUN FROM "+schema+"budget_period_con_cc WHERE customer_id = '"+cliente+"' AND YEAR = '"+periodo+"' AND PRODUCT_LINE = '"+desc_linea+"'))*((SELECT cpo FROM "+schema+"total_zone_budget_period_cc WHERE customer_id = '"+cliente+"' AND year = '"+periodo+"' AND product_line = '"+desc_linea+"')/100), (('"+jul+"'/100) * (SELECT JUL FROM "+schema+"budget_period_con_cc WHERE customer_id = '"+cliente+"' AND YEAR = '"+periodo+"' AND PRODUCT_LINE = '"+desc_linea+"'))*((SELECT cpo FROM "+schema+"total_zone_budget_period_cc WHERE customer_id = '"+cliente+"' AND year = '"+periodo+"' AND product_line = '"+desc_linea+"')/100), (('"+ago+"'/100) * (SELECT AGO FROM "+schema+"budget_period_con_cc WHERE customer_id = '"+cliente+"' AND YEAR = '"+periodo+"' AND PRODUCT_LINE = '"+desc_linea+"'))*((SELECT cpo FROM "+schema+"total_zone_budget_period_cc WHERE customer_id = '"+cliente+"' AND year = '"+periodo+"' AND product_line = '"+desc_linea+"')/100), (('"+sep+"'/100) * (SELECT SEP FROM "+schema+"budget_period_con_cc WHERE customer_id = '"+cliente+"' AND YEAR = '"+periodo+"' AND PRODUCT_LINE = '"+desc_linea+"'))*((SELECT cpo FROM "+schema+"total_zone_budget_period_cc WHERE customer_id = '"+cliente+"' AND year = '"+periodo+"' AND product_line = '"+desc_linea+"')/100), (('"+oct+"'/100) * (SELECT OCT FROM "+schema+"budget_period_con_cc WHERE customer_id = '"+cliente+"' AND YEAR = '"+periodo+"' AND PRODUCT_LINE = '"+desc_linea+"'))*((SELECT cpo FROM "+schema+"total_zone_budget_period_cc WHERE customer_id = '"+cliente+"' AND year = '"+periodo+"' AND product_line = '"+desc_linea+"')/100), (('"+nov+"'/100) * (SELECT NOV FROM "+schema+"budget_period_con_cc WHERE customer_id = '"+cliente+"' AND YEAR = '"+periodo+"' AND PRODUCT_LINE = '"+desc_linea+"'))*((SELECT cpo FROM "+schema+"total_zone_budget_period_cc WHERE customer_id = '"+cliente+"' AND year = '"+periodo+"' AND product_line = '"+desc_linea+"')/100), (('"+dic+"'/100) * (SELECT DIC FROM "+schema+"budget_period_con_cc WHERE customer_id = '"+cliente+"' AND YEAR = '"+periodo+"' AND PRODUCT_LINE = '"+desc_linea+"'))*((SELECT cpo FROM "+schema+"total_zone_budget_period_cc WHERE customer_id = '"+cliente+"' AND year = '"+periodo+"' AND product_line = '"+desc_linea+"')/100))";
	  	
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify({status:200}));

		});
	});


},

put_p5_data : function(req,res){
  	var periodo = req.param('periodo');
  	var unidad_de_negocio = req.param('unidad_de_negocio');
  	var zona = req.param('zona');
  	var presupuesto = req.param('presupuesto');
  	var clave_linea = req.param('clave_linea');
  	var desc_linea = req.param('desc_linea');
  	var clave_vendedor = req.param('clave_vendedor');
  	var desc_vendedor = req.param('desc_vendedor');
  	var cliente = req.param('cliente');
  	var desc_cliente = req.param('desc_cliente');
  	var tienda = req.param('tienda');
  

  	var ene = parseFloat(req.param('ene').replace(/,/, '')) || 0;
  	var feb = parseFloat(req.param('feb').replace(/,/, ''))  || 0;
  	var mar = parseFloat(req.param('mar').replace(/,/, ''))  || 0;
  	var abr = parseFloat(req.param('abr').replace(/,/, ''))  || 0;
  	var may = parseFloat(req.param('may').replace(/,/, ''))  || 0;
  	var jun = parseFloat(req.param('jun').replace(/,/, ''))  || 0;
  	var jul = parseFloat(req.param('jul').replace(/,/, ''))  || 0;
  	var ago = parseFloat(req.param('ago').replace(/,/, ''))  || 0;
  	var sep = parseFloat(req.param('sep').replace(/,/, ''))  || 0;
  	var oct = parseFloat(req.param('oct').replace(/,/, ''))  || 0;
  	var nov = parseFloat(req.param('nov').replace(/,/, ''))  || 0;
  	var dic = parseFloat(req.param('dic').replace(/,/, ''))  || 0;
  	var total = parseFloat(req.param('total').replace(/,/, ''))  || 0;


  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SET ANSI_WARNINGS  OFF;INSERT INTO "+schema+"entregable(periodo, unidad_de_negocio, zona, presupuesto, clave_linea, desc_linea, clave_vendedor, desc_vendedor, cliente, desc_cliente, tienda, ene, feb, mar, abr, may, jun, jul, ago, sep, oct, nov, dic, total) VALUES("+periodo+",'"+unidad_de_negocio+"','"+zona+"','"+presupuesto+"','"+clave_linea+"','"+desc_linea+"',"+clave_vendedor+",'"+desc_vendedor+"','"+cliente+"','"+desc_cliente+"','"+tienda+"',"+ene+","+feb+","+mar+","+abr+","+may+","+jun+","+jul+","+ago+","+sep+","+oct+","+nov+","+dic+","+total+")SET ANSI_WARNINGS ON;";
	  	//const query = "INSERT INTO "+schema+"entregable(periodo, unidad_de_negocio, zona, presupuesto, clave_linea, desc_linea, clave_vendedor, desc_vendedor, cliente, desc_cliente, tienda, ene, feb, mar, abr, may, jun, jul, ago, sep, oct, nov, dic) VALUES ('"+periodo+"', '"+unidad_de_negocio+"', '"+zona+"', '"+presupuesto+"', '"+clave_linea+"', '"+desc_linea+"', '"+clave_vendedor+"', '"+desc_vendedor+"', '"+cliente+"', '"+desc_cliente+"', '"+tienda+"', (('"+ene+"'/100) * (SELECT ENE FROM "+schema+"budget_period_con_cc WHERE customer_id = '"+cliente+"' AND YEAR = '"+periodo+"' AND PRODUCT_LINE = '"+desc_linea+"'))*((SELECT cpo FROM "+schema+"total_zone_budget_period_cc WHERE customer_id = '"+cliente+"' AND year = '"+periodo+"' AND product_line = '"+desc_linea+"')/100), (('"+feb+"'/100) * (SELECT FEB FROM "+schema+"budget_period_con_cc WHERE customer_id = '"+cliente+"' AND YEAR = '"+periodo+"' AND PRODUCT_LINE = '"+desc_linea+"'))*((SELECT cpo FROM "+schema+"total_zone_budget_period_cc WHERE customer_id = '"+cliente+"' AND year = '"+periodo+"' AND product_line = '"+desc_linea+"')/100), (('"+mar+"'/100) * (SELECT MAR FROM "+schema+"budget_period_con_cc WHERE customer_id = '"+cliente+"' AND YEAR = '"+periodo+"' AND PRODUCT_LINE = '"+desc_linea+"'))*((SELECT cpo FROM "+schema+"total_zone_budget_period_cc WHERE customer_id = '"+cliente+"' AND year = '"+periodo+"' AND product_line = '"+desc_linea+"')/100), (('"+abr+"'/100) * (SELECT ABR FROM "+schema+"budget_period_con_cc WHERE customer_id = '"+cliente+"' AND YEAR = '"+periodo+"' AND PRODUCT_LINE = '"+desc_linea+"'))*((SELECT cpo FROM "+schema+"total_zone_budget_period_cc WHERE customer_id = '"+cliente+"' AND year = '"+periodo+"' AND product_line = '"+desc_linea+"')/100), (('"+may+"'/100) * (SELECT MAY FROM "+schema+"budget_period_con_cc WHERE customer_id = '"+cliente+"' AND YEAR = '"+periodo+"' AND PRODUCT_LINE = '"+desc_linea+"'))*((SELECT cpo FROM "+schema+"total_zone_budget_period_cc WHERE customer_id = '"+cliente+"' AND year = '"+periodo+"' AND product_line = '"+desc_linea+"')/100), (('"+jun+"'/100) * (SELECT JUN FROM "+schema+"budget_period_con_cc WHERE customer_id = '"+cliente+"' AND YEAR = '"+periodo+"' AND PRODUCT_LINE = '"+desc_linea+"'))*((SELECT cpo FROM "+schema+"total_zone_budget_period_cc WHERE customer_id = '"+cliente+"' AND year = '"+periodo+"' AND product_line = '"+desc_linea+"')/100), (('"+jul+"'/100) * (SELECT JUL FROM "+schema+"budget_period_con_cc WHERE customer_id = '"+cliente+"' AND YEAR = '"+periodo+"' AND PRODUCT_LINE = '"+desc_linea+"'))*((SELECT cpo FROM "+schema+"total_zone_budget_period_cc WHERE customer_id = '"+cliente+"' AND year = '"+periodo+"' AND product_line = '"+desc_linea+"')/100), (('"+ago+"'/100) * (SELECT AGO FROM "+schema+"budget_period_con_cc WHERE customer_id = '"+cliente+"' AND YEAR = '"+periodo+"' AND PRODUCT_LINE = '"+desc_linea+"'))*((SELECT cpo FROM "+schema+"total_zone_budget_period_cc WHERE customer_id = '"+cliente+"' AND year = '"+periodo+"' AND product_line = '"+desc_linea+"')/100), (('"+sep+"'/100) * (SELECT SEP FROM "+schema+"budget_period_con_cc WHERE customer_id = '"+cliente+"' AND YEAR = '"+periodo+"' AND PRODUCT_LINE = '"+desc_linea+"'))*((SELECT cpo FROM "+schema+"total_zone_budget_period_cc WHERE customer_id = '"+cliente+"' AND year = '"+periodo+"' AND product_line = '"+desc_linea+"')/100), (('"+oct+"'/100) * (SELECT OCT FROM "+schema+"budget_period_con_cc WHERE customer_id = '"+cliente+"' AND YEAR = '"+periodo+"' AND PRODUCT_LINE = '"+desc_linea+"'))*((SELECT cpo FROM "+schema+"total_zone_budget_period_cc WHERE customer_id = '"+cliente+"' AND year = '"+periodo+"' AND product_line = '"+desc_linea+"')/100), (('"+nov+"'/100) * (SELECT NOV FROM "+schema+"budget_period_con_cc WHERE customer_id = '"+cliente+"' AND YEAR = '"+periodo+"' AND PRODUCT_LINE = '"+desc_linea+"'))*((SELECT cpo FROM "+schema+"total_zone_budget_period_cc WHERE customer_id = '"+cliente+"' AND year = '"+periodo+"' AND product_line = '"+desc_linea+"')/100), (('"+dic+"'/100) * (SELECT DIC FROM "+schema+"budget_period_con_cc WHERE customer_id = '"+cliente+"' AND YEAR = '"+periodo+"' AND PRODUCT_LINE = '"+desc_linea+"'))*((SELECT cpo FROM "+schema+"total_zone_budget_period_cc WHERE customer_id = '"+cliente+"' AND year = '"+periodo+"' AND product_line = '"+desc_linea+"')/100))";
	  	
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify({status:200}));

		});
	});


},

put_p5_data_forecast : function(req,res){
  	var periodo = req.param('periodo');
  	var unidad_de_negocio = req.param('unidad_de_negocio');
  	var zona = req.param('zona');
  	var presupuesto = req.param('presupuesto');
  	var clave_linea = req.param('clave_linea');
  	var desc_linea = req.param('desc_linea');
  	var clave_vendedor = req.param('clave_vendedor');
  	var desc_vendedor = req.param('desc_vendedor');
  	var cliente = req.param('cliente');
  	var desc_cliente = req.param('desc_cliente');
  	var tienda = req.param('tienda');
  	var forecast = req.param('forecast');
  	var ene = req.param('ene');
  	var feb = req.param('feb');
  	var mar = req.param('mar');
  	var abr = req.param('abr');
  	var may = req.param('may');
  	var jun = req.param('jun');
  	var jul = req.param('jul');
  	var ago = req.param('ago');
  	var sep = req.param('sep');
  	var oct = req.param('oct');
  	var nov = req.param('nov');
  	var dic = req.param('dic');
  	var total = req.param('total');

  	var ene = parseFloat(req.param('ene').replace(/,/, '')) || 0;
  	var feb = parseFloat(req.param('feb').replace(/,/, ''))  || 0;
  	var mar = parseFloat(req.param('mar').replace(/,/, ''))  || 0;
  	var abr = parseFloat(req.param('abr').replace(/,/, ''))  || 0;
  	var may = parseFloat(req.param('may').replace(/,/, ''))  || 0;
  	var jun = parseFloat(req.param('jun').replace(/,/, ''))  || 0;
  	var jul = parseFloat(req.param('jul').replace(/,/, ''))  || 0;
  	var ago = parseFloat(req.param('ago').replace(/,/, ''))  || 0;
  	var sep = parseFloat(req.param('sep').replace(/,/, ''))  || 0;
  	var oct = parseFloat(req.param('oct').replace(/,/, ''))  || 0;
  	var nov = parseFloat(req.param('nov').replace(/,/, ''))  || 0;
  	var dic = parseFloat(req.param('dic').replace(/,/, ''))  || 0;
  	var total = parseFloat(req.param('total').replace(/,/, ''))  || 0;


  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SET ansi_warnings OFF; INSERT INTO "+schema+"entregable_forecast(periodo, unidad_de_negocio, zona, presupuesto, clave_linea, desc_linea, clave_vendedor, desc_vendedor, cliente, desc_cliente, tienda, ene, feb, mar, abr, may, jun, jul, ago, sep, oct, nov, dic, total, forecast) VALUES ("+periodo+", '"+unidad_de_negocio+"', '"+zona+"', '"+presupuesto+"', '"+clave_linea+"', '"+desc_linea+"', "+clave_vendedor+", '"+desc_vendedor+"', '"+cliente+"', '"+desc_cliente+"', '"+tienda+"', "+ene+", "+feb+", "+mar+", "+abr+", "+may+", "+jun+", "+jul+", "+ago+", "+sep+", "+oct+", "+nov+", "+dic+", "+total+", "+forecast+") SET ansi_warnings ON;";
	  	
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify({status:200}));

		});
	});

},


get_data_csv_cc : function(req,res){
  	var cliente = req.param('cliente');
  	var periodo = req.param('periodo');


  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT * FROM "+schema+"entregable_cc WHERE periodo = '"+periodo+"' AND cliente = "+cliente;

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
},

get_data_csv : function(req,res){
  	var commercial_zone = req.param('commercial_zone');
  	var periodo = req.param('periodo');


  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT * FROM "+schema+"entregable WHERE periodo = '"+periodo+"' AND zona = '"+commercial_zone+"'";

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;
		    
		    res.setHeader('Content-Type', 'application/json');
	   		res.end(JSON.stringify(result.recordset));

		});
	});
},

// F2

//Sellers

get_all_sellers: function(req,res){

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT * FROM "+schema+"vendedores";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},

get_all_sellers_names: function(req,res){

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT seller_name FROM "+schema+"vendedores";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},

get_pk_seller_byname: function(req,res){
  	var seller_name = req.param('seller_name');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT TOP 1 seller_pk FROM "+schema+"vendedores WHERE seller_name = '"+seller_name+"'";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},

get_pk_customer_byname: function(req,res){
  	var customer = req.param('customer');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT TOP 1 pk_customer FROM "+schema+"customers WHERE customer = '"+customer+"'";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},

insert_new_seller: function(req,res){

	var nombre = req.param('nombre');
  	var noemp = req.param('noemp');
  	var status = req.param('status');
  	var cz = req.param('cz');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "INSERT INTO "+schema+"vendedores (seller_id, seller_name, seller_status, commercial_zone) VALUES('"+noemp+"', '"+nombre+"', "+status+", "+cz+");";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify({status:200}));
		});
	});
},

insert_new_customer: function(req,res){
	var cliente = req.param('cliente');
  	var clid = req.param('clid');
  	var tipo_cliente = req.param('tipo_cliente');
  	var seller = req.param('seller');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "INSERT INTO "+schema+"customers (pk_customer, customer, customer_id, customer_type_id,seller) VALUES(((SELECT TOP 1 pk_customer FROM customers ORDER BY pk_customer DESC) + 1),'"+cliente+"', '"+clid+"', "+tipo_cliente+",(SELECT TOP 1 seller_pk FROM "+schema+"vendedores v WHERE seller_name = '"+seller+"' ));";
	  	
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify({status:200}));
		});
	});
},

update_customer: function(req,res){

	var pk_customer = req.param('pk_customer');
	var cliente = req.param('customer');
  	var clid = req.param('customer_id');
  	var tipo_cliente = req.param('customer_type_id');
  	var seller = req.param('seller');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "UPDATE "+schema+"customers SET customer = '"+cliente+"', customer_id = '"+clid+"', customer_type_id = "+tipo_cliente+", seller = (SELECT TOP 1 seller_pk FROM "+schema+"vendedores v WHERE seller_name = '"+seller+"' ) WHERE pk_customer = '"+pk_customer+"'";
	  	
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify({status:200}));
		});
	});
},

delete_customer: function(req,res){

	var pk_customer = req.param('pk_customer');
	
  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "DELETE FROM "+schema+"customers WHERE pk_customer="+pk_customer+";";
	  	
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify({status:200}));
		});
	});
},

update_seller: function(req,res){

	var id = req.param('id');
	var nombre = req.param('nombre');
  	var noemp = req.param('noemp');
  	var status = req.param('status');
  	var cz = req.param('cz');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "UPDATE "+schema+"vendedores SET seller_id='"+noemp+"', seller_name='"+nombre+"', seller_status="+status+", commercial_zone="+cz+" WHERE seller_pk="+id+";";
	  	
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify({status:200}));
		});
	});
},


delete_seller: function(req,res){

	var id = req.param('id');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "DELETE FROM "+schema+"vendedores WHERE seller_pk="+id+";";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify({status:200}));
		});
	});
},

//Sellers

get_all_customers: function(req,res){

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	//const query = "SELECT * FROM "+schema+"customers";
	  	const query = "SELECT c.pk_customer,c.customer ,c.customer_id ,c.customer_type_id,c.seller,(SELECT v.seller_name FROM "+schema+"vendedores v WHERE v.seller_pk = c.seller) AS seller_name FROM "+schema+"customers c";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},

get_all_cc: function(req,res){

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	//const query = "SELECT * FROM "+schema+"customers";
	  	const query = "SELECT c.customer FROM "+schema+"customers c WHERE customer_type_id = 2";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},



//tiendas

get_all_stores_cc: function(req,res){

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT s.stores_cc_pk, s.tienda, s.tienda_desc, s.customer_id, s.customer, s.commercial_zone, (SELECT v.seller_name FROM "+schema+"vendedores v WHERE v.seller_pk = s.seller) AS seller_name FROM "+schema+"stores_cc s";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},


insert_new_store: function(req,res){
	var tienda = req.param('tienda');
  	var tienda_desc = req.param('tienda_desc');
  	var customer = req.param('customer');
  	var commercial_zone = req.param('commercial_zone');
  	var seller = req.param('seller');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "INSERT INTO "+schema+"stores_cc (stores_cc_pk,tienda,tienda_desc,customer_id,customer,commercial_zone,seller) VALUES(((SELECT TOP 1 stores_cc_pk FROM stores_cc ORDER BY stores_cc_pk DESC) + 1),'"+tienda+"', '"+tienda_desc+"', (SELECT TOP 1 customer_id FROM "+schema+"customers WHERE customer = '"+customer+"' ),'"+customer+"','"+commercial_zone+"',(SELECT TOP 1 seller_pk FROM "+schema+"vendedores v WHERE seller_name = '"+seller+"' ));";
	  	
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify({status:200}));
		});
	});
},

update_store: function(req,res){
	var stores_cc_pk = req.param('stores_cc_pk');
	var tienda = req.param('tienda');
  	var tienda_desc = req.param('tienda_desc');
  	var customer = req.param('customer');
  	var commercial_zone = req.param('commercial_zone');
  	var seller = req.param('seller');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	
	  	const query = "UPDATE "+schema+"stores_cc SET tienda = '"+tienda+"', tienda_desc = '"+tienda_desc+"', customer_id = (SELECT TOP 1 customer_id FROM "+schema+"customers WHERE customer = '"+customer+"' ) , customer = '"+customer+"', commercial_zone = '"+commercial_zone+"', seller =  (SELECT TOP 1 seller_pk FROM "+schema+"vendedores v WHERE seller_name = '"+seller+"' ) WHERE stores_cc_pk = "+stores_cc_pk;

	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify({status:200}));
		});
	});
},

delete_store: function(req,res){

	var stores_cc_pk = req.param('stores_cc_pk');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "DELETE FROM "+schema+"stores_cc WHERE stores_cc_pk="+stores_cc_pk+";";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify({status:200}));
		});
	});
},


get_all_commercial_zones: function(req,res){

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT * FROM "+schema+"commercial_zones";
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},

get_forecast_status: function(req,res){

	var commercial_zone = req.param('commercial_zone');
	var forecast = req.param('forecast');
	var year = req.param('year');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "SELECT DISTINCT status FROM "+schema+"forecast_con WHERE year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast;
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result.recordset));
		});
	});
},


cerrar_forecast: function(req,res){

	var commercial_zone = req.param('commercial_zone');
	var forecast = req.param('forecast');
	var year = req.param('year');
	var status = req.param('status');

  	sql.connect(db_config, function (err) {
    
	    if (err) console.log(err);

	    con = new sql.Request();
	  	const query = "UPDATE "+schema+"forecast_con SET status = "+status+" WHERE year = "+year+" AND commercial_zone = '"+commercial_zone+"' AND forecast = "+forecast;
	  	con.query(query, (err, result, fields) => {
		    // if any error while executing above query, throw error
		    if (err) throw err;

		    // if there is no error, you have the result
		    //console.log(result);
		    res.json({ result: 200})
		});
	});
},


  /*get_prom_past_years_by_month: function(req,res){
  	var product_line = req.param('product_line');
  	var commercial_zone = req.param('commercial_zone');
  	var 

  }*/

  // reportes
  reporte_resumen: async (req, res) => {
  	var forecast = req.param('forecast');
  	let reportData = [];
	const currentYear = new Date().getFullYear();
	try {
		const pool = await sql.connect(db_config); 
		const queryCol0 = pool.request().query('SELECT alias FROM '+schema+'product_lines ORDER BY orden');
		const queryCol1 = pool.request().input('year', currentYear - 2)
		.query(`SELECT Round(SUM(vr_year1), 2) \'VentaRealHace2\' FROM( SELECT product_line, vr_year1 FROM `+schema+`total_zone_forecast WHERE forecast = `+forecast+` UNION ALL SELECT product_line, vr_year1 FROM `+schema+`total_zone_forecast_cc WHERE forecast = `+forecast+`) T, `+schema+`product_lines P WHERE T.product_line = P.product_line GROUP BY T.product_line ORDER BY MAX(P.orden)`);
		//.query(`SELECT ROUND(SUM(A.m2),2) AS \'VentaRealHace2\' FROM `+schema+`budget_period_group AS A JOIN `+schema+`product_lines AS B ON A.product_line = B.product_line WHERE A.year = @year GROUP BY B.alias ORDER BY MAX(B.orden)`); // agregar AND commercial zone para reporte 2
		const queryCol2 = pool.request().input('year', currentYear - 1)
		.query(`SELECT Round(SUM(vr_year2), 2) \'VentaRealHace1\' FROM( SELECT product_line, vr_year2 FROM `+schema+`total_zone_forecast WHERE forecast = `+forecast+` UNION ALL SELECT product_line, vr_year2 FROM `+schema+`total_zone_forecast_cc WHERE forecast = `+forecast+`) T, `+schema+`product_lines P WHERE T.product_line = P.product_line GROUP BY T.product_line ORDER BY MAX(P.orden)`);
		//.query(`SELECT ROUND(SUM(A.m2),2) AS \'VentaRealHace1\' FROM `+schema+`budget_period_group AS A JOIN `+schema+`product_lines AS B ON A.product_line = B.product_line WHERE A.year = @year GROUP BY B.alias ORDER BY MAX(B.orden)`);
		const queryCol3 = pool.request().input('year', currentYear)
		.query(`SELECT Round(SUM(vr_year3), 2) \'VentaReal\' FROM( SELECT product_line, vr_year3 FROM `+schema+`total_zone_forecast WHERE forecast = `+forecast+` UNION ALL SELECT product_line, vr_year3 FROM `+schema+`total_zone_forecast_cc WHERE forecast = `+forecast+`) T, `+schema+`product_lines P WHERE T.product_line = P.product_line GROUP BY T.product_line ORDER BY MAX(P.orden)`);
		const queryCol5 = pool.request().input('year', currentYear)
		.query(`SELECT ROUND(SUM(tot),2) \'PresupuestoTotalAct\' FROM `+schema+`product_lines AS P LEFT JOIN (SELECT id_product_line, product_line, tot FROM `+schema+`presupuestos A WHERE A.periodo=@year UNION ALL SELECT id_product_line, product_line, tot FROM `+schema+`presupuestos_cc A WHERE A.periodo=@year) AS T ON P.id_product_line = T.id_product_line GROUP BY P.id_product_line, alias ORDER BY MAX(orden)`);
		const queryCol7 = pool.request()
		.query(`SELECT ROUND(SUM(extraord),2) \'VentaExtraord\' FROM( SELECT product_line, extraord FROM `+schema+`total_zone_forecast UNION ALL SELECT product_line, extraord FROM `+schema+`total_zone_forecast_cc) T, `+schema+`product_lines P WHERE T.product_line = P.product_line GROUP BY T.product_line ORDER BY MAX(P.orden)`);
		//.query(`SELECT ROUND(SUM(extraord),2) \'VentaExtraord\' FROM ( SELECT product_line, extraord FROM `+schema+`total_zone_forecast UNION ALL SELECT product_line, extraord FROM `+schema+`total_zone_forecast_cc) T GROUP BY product_line`);
		const queryCol9 = pool.request()
		.query(`SELECT Round(SUM(poyear), 2) \'PropuestaGerentes\' FROM( SELECT product_line, poyear FROM `+schema+`total_zone_forecast WHERE forecast = `+forecast+` UNION ALL SELECT product_line, poyear FROM `+schema+`total_zone_forecast_cc WHERE forecast = `+forecast+`) T, `+schema+`product_lines P WHERE T.product_line = P.product_line GROUP BY T.product_line ORDER BY MAX(P.orden)`);
		//.query(`SELECT Round(SUM(poyear), 2) \ 'PropuestaGerentes\' FROM(SELECT product_line, poyear FROM `+schema+`total_zone_forecast WHERE forecast = \'`+forecast+`\' UNION ALL SELECT product_line, poyear FROM `+schema+`total_zone_forecast_cc WHERE forecast = \'`+forecast+`\') T  GROUP BY product_line`);
		//.query(`SELECT ROUND(SUM(poyear),2) \'PropuestaGerentes\' FROM ( SELECT product_line, poyear FROM `+schema+`total_zone_forecast UNION ALL  SELECT product_line, poyear FROM `+schema+`total_zone_forecast_cc) T GROUP BY product_line`);
		const queryCol12 = pool.request()
		//.query(`SELECT ROUND(SUM(proyyear),2) \'ProyectosSigPresupuesto\' FROM ( SELECT product_line, proyyear FROM `+schema+`total_zone_forecast UNION ALL SELECT product_line, proyyear FROM `+schema+`total_zone_forecast_cc) T GROUP BY product_line`);
		.query(`SELECT ROUND(SUM(proyyear),2) \'ProyectosSigPresupuesto\' FROM( SELECT product_line, proyyear FROM `+schema+`total_zone_forecast UNION ALL SELECT product_line, proyyear FROM `+schema+`total_zone_forecast_cc) T, `+schema+`product_lines P WHERE T.product_line = P.product_line GROUP BY T.product_line ORDER BY MAX(P.orden)`);
		const queryResults = await Promise.all([queryCol0, queryCol1, queryCol2, queryCol3, queryCol5, queryCol7, queryCol9, queryCol12]);
		for (let index = 0; index <= 15; index++) {
			if (index == 0) {
				const recordset = queryResults[0].recordset;
				recordset.forEach((record) => {
					reportData.push(record);
				});
			} else if (index < 4) {
				const recordset = queryResults[index].recordset; 
				recordset.forEach((record, recordIndex) => {					
					const key = Object.keys(record)[0];
					reportData[recordIndex][key] = record[key];
				});
			} else if(index == 4) {
				reportData.forEach((reportRow, rowIndex) => {
					reportRow['CompActualAnterior'] = `=D${rowIndex + 1}/C${rowIndex + 1}`
				});
			} else if(index == 6) {
				reportData.forEach((reportRow, rowIndex) => {
					reportRow[`F${currentYear}vsPpto${currentYear}`] = `=D${rowIndex + 1}/F${rowIndex + 1}`;
				});
			} else if (index == 8) {
				reportData.forEach((reportRow, rowIndex) => {
					reportRow[`${currentYear}Base`] = `=D${rowIndex + 1} - H${rowIndex + 1}`;
				});
			} else if (index == 10) {
				reportData.forEach((reportRow, rowIndex) => {
					reportRow['PorcentajeCrecimiento'] = `=(J${rowIndex + 1}/I${rowIndex + 1} - 1)*100`;
				});
			} else if (index == 11) {
				reportData.forEach((reportRow, rowIndex) => {
					reportRow[`m2BasevsPresup${currentYear}}`] = `=J${rowIndex + 1} - I${rowIndex + 1}`;
				});
			} else if (index == 13) {
				reportData.forEach((reportRow, rowIndex) => {
					reportRow[`Presupuesto${currentYear}ConProyectos`] = `=M${rowIndex + 1} + J${rowIndex + 1}`;
				});
			} else if(index == 14) {
				reportData.forEach((reportRow, rowIndex) => {
					reportRow[`PorcentajeCrecPresupuesto${currentYear}vsF${currentYear-1}`] = `=(N${rowIndex + 1}/D${rowIndex + 1} - 1)*100`;
				});
			} else if(index == 15) {
				reportData.forEach((reportRow, rowIndex) => {
					reportRow[`Presupuesto${currentYear}vsF${currentYear - 1}m2`] = `=N${rowIndex + 1} - D${rowIndex + 1}`;
				});
			} else {
				let resultIndex;
				switch (index) {
					case 5:
						resultIndex = 4;
						break;
					case 7:
						resultIndex = 5;
						break;
					case 9:
						resultIndex = 6;
						break;
					case 12:
						resultIndex = 7;
						break;
					default:
						break;
				}
				const recordset = queryResults[resultIndex].recordset;
				recordset.forEach((record, recordIndex) => {					
					const key = Object.keys(record)[0];
					const value = record[key] == null ? 0 : record[key];
					reportData[recordIndex][key] = value;
				});
			}
		}
		res.status(200).json({reportData});
	} catch (error) {
		res.status(500).json({error});
	}
  },



  reporte_resumen3: async (req, res) => {
  	var forecast = req.query.forecast;
  	let reportData = [];
	const currentYear = new Date().getFullYear();
	try {
		const pool = await sql.connect(db_config); 

		const queryCol0 = pool.request().query('SELECT alias FROM '+schema+'product_lines ORDER BY orden');

		var queryCol1 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.ENE),2),0) AS \'ENE\' FROM `+schema+`forecast_con AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = @forecast GROUP BY b.alias ORDER BY MAX(b.orden)`);

		const queryCol2 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.FEB),2),0) AS \'FEB\' FROM `+schema+`forecast_con AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = @forecast GROUP BY b.alias ORDER BY MAX(b.orden)`);
		
		const queryCol3 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.MAR),2),0) AS \'MAR\' FROM `+schema+`forecast_con AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = @forecast GROUP BY b.alias ORDER BY MAX(b.orden)`);
		
		const queryCol4 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.ABR),2),0) AS \'ABR\' FROM `+schema+`forecast_con AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = @forecast GROUP BY b.alias ORDER BY MAX(b.orden)`);

		const queryCol5 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.MAY),2),0) AS \'MAY\' FROM `+schema+`forecast_con AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = @forecast GROUP BY b.alias ORDER BY MAX(b.orden)`);

		const queryCol6 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.JUN),2),0) AS \'JUN\' FROM `+schema+`forecast_con AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = @forecast GROUP BY b.alias ORDER BY MAX(b.orden)`);

		const queryCol7 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.JUL),2),0) AS \'JUL\' FROM `+schema+`forecast_con AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = @forecast GROUP BY b.alias ORDER BY MAX(b.orden)`);

		const queryCol8 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.AGO),2),0) AS \'AGO\' FROM `+schema+`forecast_con AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = @forecast GROUP BY b.alias ORDER BY MAX(b.orden)`);


		const queryCol9 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.SEP),2),0) AS \'SEP\' FROM `+schema+`forecast_con AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = @forecast GROUP BY b.alias ORDER BY MAX(b.orden)`);

		const queryCol10 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.OCT),2),0) AS \'OCT\' FROM `+schema+`forecast_con AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = @forecast GROUP BY b.alias ORDER BY MAX(b.orden)`);

		const queryCol11 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.NOV),2),0) AS \'NOV\' FROM `+schema+`forecast_con AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = @forecast GROUP BY b.alias ORDER BY MAX(b.orden)`);

		const queryCol12 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.DIC),2),0) AS \'DIC\' FROM `+schema+`forecast_con AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = @forecast GROUP BY b.alias ORDER BY MAX(b.orden)`);

		const queryCol13 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.TOT),2),0) AS \'TOT\' FROM `+schema+`forecast_con AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND a.forecast = @forecast GROUP BY b.alias ORDER BY MAX(b.orden)`);

		const queryCol14 = pool.request().input('year', currentYear)
		.query(`SELECT ROUND(MAX(tot),2) AS \'PRES\' FROM `+schema+`presupuestos AS A JOIN `+schema+`product_lines AS B ON A.product_line = B.product_line WHERE A.periodo = @year GROUP BY B.alias ORDER BY MAX(B.orden)`);

		const queryCol17 = pool.request().input('year', currentYear)
		.query(`SELECT ROUND(MAX(extraord),2) AS \'EXTR\' FROM `+schema+`total_zone_forecast AS A JOIN `+schema+`product_lines AS B ON A.product_line = B.product_line WHERE A.year = @year GROUP BY B.alias ORDER BY MAX(B.orden)`);

		const queryCol18 = pool.request().input('year', currentYear - 2)
		.query(`SELECT ROUND(SUM(A.m2),2) AS \'TOTVR\' FROM `+schema+`budget_period_group AS A JOIN `+schema+`product_lines AS B ON A.product_line = B.product_line WHERE A.year = @year GROUP BY B.alias ORDER BY MAX(B.orden)`);



		const queryResults = await Promise.all([queryCol0, queryCol1, queryCol2, queryCol3, queryCol4, queryCol5, queryCol6, queryCol7, queryCol8, queryCol9, queryCol10, queryCol11, queryCol12, queryCol13, queryCol14, queryCol17, queryCol18]);


		
		for (let index = 0; index <= 20; index++) {
			if (index == 0) {
				const recordset = queryResults[0].recordset;
				recordset.forEach((record) => {
					reportData.push(record);
				});
			} else if (index < 14) {
				var recordset = queryResults[index].recordset;

				if (recordset.length == 0 && index == 1) {
					recordset = [{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0}]
				}else if (recordset.length == 0 && index == 2) {
					recordset = [{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0}]
				}else if (recordset.length == 0 && index == 3) {
					recordset = [{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0}]
				}else if (recordset.length == 0 && index == 4) {
					recordset = [{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0}]
				}else if (recordset.length == 0 && index == 5) {
					recordset = [{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0}]
				}else if (recordset.length == 0 && index == 6) {
					recordset = [{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0}]
				}else if (recordset.length == 0 && index == 7) {
					recordset = [{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0}]
				}else if (recordset.length == 0 && index == 8) {
					recordset = [{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0}]
				}else if (recordset.length == 0 && index == 9) {
					recordset = [{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0}]
				}else if (recordset.length == 0 && index == 10) {
					recordset = [{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0}]
				}else if (recordset.length == 0 && index == 11) {
					recordset = [{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0}]
				}else if (recordset.length == 0 && index == 12) {
					recordset = [{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0}]
				}else if (recordset.length == 0 && index == 13) {
					recordset = [{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0}]
				}

				recordset.forEach((record, recordIndex) => {					
					const key = Object.keys(record)[0];
					reportData[recordIndex][key] = record[key];
				});

				console.log(recordset);

			} else if (index == 14 ) {
				const recordset = queryResults[index].recordset; 
				recordset.forEach((record, recordIndex) => {					
					const key = Object.keys(record)[0];
					reportData[recordIndex][key] = record[key];
				});
			} else if(index == 15) {
				reportData.forEach((reportRow, rowIndex) => {
					reportRow[`PorcCumpl${currentYear}`] = `=(N${rowIndex + 1}/O${rowIndex + 1})*100`;
				});
			} else if(index == 16) {
				reportData.forEach((reportRow, rowIndex) => {
					reportRow[`M2${currentYear}`] = `=O${rowIndex + 1}-N${rowIndex + 1}`;
				});
			} else if(index == 17) {
				const recordset = queryResults[15].recordset; 
				recordset.forEach((record, recordIndex) => {					
					const key = Object.keys(record)[0];
					reportData[recordIndex][key] = record[key];
				});
			} else if(index == 18) {
				const recordset = queryResults[16].recordset; 
				recordset.forEach((record, recordIndex) => {					
					const key = Object.keys(record)[0];
					reportData[recordIndex][key] = record[key];
				});
			} else if(index == 19) {
				reportData.forEach((reportRow, rowIndex) => {
					reportRow[`Crecimiento${currentYear - 2}`] = `=(N${rowIndex + 1}/S${rowIndex + 1})*100`;
				});
			}
		}
		res.status(200).json({reportData});
	} catch (error) {
		res.status(500).json({error});
	}
  },

  reporte_resumen_zona: async (req, res) => {

  	var commercial_zone = req.param('commercial_zone');
  	var forecast = req.param('forecast');

  	let reportData = [];
	const currentYear = new Date().getFullYear();
	try {
		const pool = await sql.connect(db_config); 

		const queryCol0 = pool.request().query('SELECT alias FROM '+schema+'product_lines ORDER BY orden');

		

		var queryCol1 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.ENE),2),0) AS ENE FROM `+schema+`forecast_con AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+forecast+` AND commercial_zone = '`+commercial_zone+`' GROUP BY b.alias ORDER BY MAX(b.orden)`);

		const queryCol2 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.FEB),2),0) AS FEB FROM `+schema+`forecast_con AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+forecast+` AND commercial_zone = '`+commercial_zone+`' GROUP BY b.alias ORDER BY MAX(b.orden)`);
		
		const queryCol3 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.MAR),2),0) AS MAR FROM `+schema+`forecast_con AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+forecast+` AND commercial_zone = '`+commercial_zone+`' GROUP BY b.alias ORDER BY MAX(b.orden)`);
		
		const queryCol4 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.ABR),2),0) AS ABR FROM `+schema+`forecast_con AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+forecast+` AND commercial_zone = '`+commercial_zone+`' GROUP BY b.alias ORDER BY MAX(b.orden)`);

		const queryCol5 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.MAY),2),0) AS MAY FROM `+schema+`forecast_con AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+forecast+` AND commercial_zone = '`+commercial_zone+`' GROUP BY b.alias ORDER BY MAX(b.orden)`);

		const queryCol6 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.JUN),2),0) AS JUN FROM `+schema+`forecast_con AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+forecast+` AND commercial_zone = '`+commercial_zone+`' GROUP BY b.alias ORDER BY MAX(b.orden)`);

		const queryCol7 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.JUL),2),0) AS JUL FROM `+schema+`forecast_con AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+forecast+` AND commercial_zone = '`+commercial_zone+`' GROUP BY b.alias ORDER BY MAX(b.orden)`);

		const queryCol8 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.AGO),2),0) AS AGO FROM `+schema+`forecast_con AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+forecast+` AND commercial_zone = '`+commercial_zone+`' GROUP BY b.alias ORDER BY MAX(b.orden)`);


		const queryCol9 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.SEP),2),0) AS SEP FROM `+schema+`forecast_con AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+forecast+` AND commercial_zone = '`+commercial_zone+`' GROUP BY b.alias ORDER BY MAX(b.orden)`);

		const queryCol10 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.OCT),2),0) AS OCT FROM `+schema+`forecast_con AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+forecast+` AND commercial_zone = '`+commercial_zone+`' GROUP BY b.alias ORDER BY MAX(b.orden)`);

		const queryCol11 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.NOV),2),0) AS NOV FROM `+schema+`forecast_con AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+forecast+` AND commercial_zone = '`+commercial_zone+`' GROUP BY b.alias ORDER BY MAX(b.orden)`);

		const queryCol12 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.DIC),2),0) AS DIC FROM `+schema+`forecast_con AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+forecast+` AND commercial_zone = '`+commercial_zone+`' GROUP BY b.alias ORDER BY MAX(b.orden)`);

		const queryCol13 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.TOT),2),0) AS TOT FROM `+schema+`forecast_con AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+forecast+` AND commercial_zone = '`+commercial_zone+`' GROUP BY b.alias ORDER BY MAX(b.orden)`);

		const queryCol14 = pool.request().input('year', currentYear)
		.query(`SELECT ROUND(MAX(tot),2) AS \'PRES\' FROM `+schema+`presupuestos AS A JOIN `+schema+`product_lines AS B ON A.product_line = B.product_line WHERE A.periodo = @year AND commercial_zone = '`+commercial_zone+`' GROUP BY B.alias ORDER BY MAX(B.orden)`);

		const queryCol17 = pool.request().input('year', currentYear)
		.query(`SELECT ROUND(MAX(extraord),2) AS \'EXTR\' FROM `+schema+`total_zone_forecast AS A JOIN `+schema+`product_lines AS B ON A.product_line = B.product_line WHERE A.year = @year AND commercial_zone = '`+commercial_zone+`' GROUP BY B.alias ORDER BY MAX(B.orden)`);

		const queryCol18 = pool.request().input('year', currentYear - 2)
		.query(`SELECT ROUND(SUM(A.m2),2) AS \'TOTVR\' FROM `+schema+`budget_period_group AS A JOIN `+schema+`product_lines AS B ON A.product_line = B.product_line WHERE A.year = @year AND commercial_zone = '`+commercial_zone+`' GROUP BY B.alias ORDER BY MAX(B.orden)`);

		

		const queryResults = await Promise.all([queryCol0, queryCol1, queryCol2, queryCol3, queryCol4, queryCol5, queryCol6, queryCol7, queryCol8, queryCol9, queryCol10, queryCol11, queryCol12, queryCol13, queryCol14, queryCol17, queryCol18]);

		

		

		for (let index = 0; index <= 20; index++) {
			if (index == 0) {
				const recordset = queryResults[0].recordset;
				recordset.forEach((record) => {
					reportData.push(record);
				});

				console.log(recordset);
			}else if (index < 14) {
				var recordset = queryResults[index].recordset;

				if (recordset.length == 0 && index == 1) {
					recordset = [{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0}]
				}else if (recordset.length == 0 && index == 2) {
					recordset = [{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0}]
				}else if (recordset.length == 0 && index == 3) {
					recordset = [{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0}]
				}else if (recordset.length == 0 && index == 4) {
					recordset = [{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0}]
				}else if (recordset.length == 0 && index == 5) {
					recordset = [{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0}]
				}else if (recordset.length == 0 && index == 6) {
					recordset = [{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0}]
				}else if (recordset.length == 0 && index == 7) {
					recordset = [{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0}]
				}else if (recordset.length == 0 && index == 8) {
					recordset = [{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0}]
				}else if (recordset.length == 0 && index == 9) {
					recordset = [{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0}]
				}else if (recordset.length == 0 && index == 10) {
					recordset = [{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0}]
				}else if (recordset.length == 0 && index == 11) {
					recordset = [{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0}]
				}else if (recordset.length == 0 && index == 12) {
					recordset = [{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0}]
				}else if (recordset.length == 0 && index == 13) {
					recordset = [{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0}]
				}

				recordset.forEach((record, recordIndex) => {					
					const key = Object.keys(record)[0];
					reportData[recordIndex][key] = record[key];
				});

				console.log(recordset);

			} else if (index == 14 ) {
				const recordset = queryResults[index].recordset; 
				recordset.forEach((record, recordIndex) => {					
					const key = Object.keys(record)[0];
					reportData[recordIndex][key] = record[key];
				});
			} else if(index == 15) {
				reportData.forEach((reportRow, rowIndex) => {
					reportRow[`PorcCumpl${currentYear}`] = `=(N${rowIndex + 1}/O${rowIndex + 1})*100`;
				});
			} else if(index == 16) {
				reportData.forEach((reportRow, rowIndex) => {
					reportRow[`M2${currentYear}`] = `=O${rowIndex + 1}-N${rowIndex + 1}`;
				});
			} else if(index == 17) {
				const recordset = queryResults[15].recordset; 
				recordset.forEach((record, recordIndex) => {					
					const key = Object.keys(record)[0];
					reportData[recordIndex][key] = record[key];
				});
			} else if(index == 18) {
				const recordset = queryResults[16].recordset; 
				recordset.forEach((record, recordIndex) => {					
					const key = Object.keys(record)[0];
					reportData[recordIndex][key] = record[key];
				});
			} else if(index == 19) {
				reportData.forEach((reportRow, rowIndex) => {
					reportRow[`Crecimiento${currentYear - 2}`] = `=(N${rowIndex + 1}/S${rowIndex + 1})*100`;
				});
			}
		}
		res.status(200).json({reportData});
	} catch (error) {
		res.status(500).json({error});
	}
  },

reporte_resumen_cc: async (req, res) => {

  	var forecast = req.param('forecast');

  	let reportData = [];
	const currentYear = new Date().getFullYear();
	try {
		const pool = await sql.connect(db_config); 

		const queryCol0 = pool.request().query('SELECT alias FROM '+schema+'product_lines ORDER BY orden');

		

		const queryCol1 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.ENE),2),0) AS ENE FROM `+schema+`forecast_con_cc AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+forecast+` GROUP BY b.alias ORDER BY max(b.orden)`);

		const queryCol2 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.FEB),2),0) AS FEB FROM `+schema+`forecast_con_cc AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+forecast+` GROUP BY b.alias ORDER BY max(b.orden)`);
		
		const queryCol3 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.MAR),2),0) AS MAR FROM `+schema+`forecast_con_cc AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+forecast+` GROUP BY b.alias ORDER BY max(b.orden)`);
		
		const queryCol4 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.ABR),2),0) AS ABR FROM `+schema+`forecast_con_cc AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+forecast+` GROUP BY b.alias ORDER BY max(b.orden)`);

		const queryCol5 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.MAY),2),0) AS MAY FROM `+schema+`forecast_con_cc AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+forecast+` GROUP BY b.alias ORDER BY max(b.orden)`);

		const queryCol6 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.JUN),2),0) AS JUN FROM `+schema+`forecast_con_cc AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+forecast+` GROUP BY b.alias ORDER BY max(b.orden)`);

		const queryCol7 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.JUL),2),0) AS JUL FROM `+schema+`forecast_con_cc AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+forecast+` GROUP BY b.alias ORDER BY max(b.orden)`);

		const queryCol8 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.AGO),2),0) AS AGO FROM `+schema+`forecast_con_cc AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+forecast+` GROUP BY b.alias ORDER BY max(b.orden)`);


		const queryCol9 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.SEP),2),0) AS SEP FROM `+schema+`forecast_con_cc AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+forecast+` GROUP BY b.alias ORDER BY max(b.orden)`);

		const queryCol10 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.OCT),2),0) AS OCT FROM `+schema+`forecast_con_cc AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+forecast+` GROUP BY b.alias ORDER BY max(b.orden)`);

		const queryCol11 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.NOV),2),0) AS NOV FROM `+schema+`forecast_con_cc AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+forecast+` GROUP BY b.alias ORDER BY max(b.orden)`);

		const queryCol12 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.DIC),2),0) AS DIC FROM `+schema+`forecast_con_cc AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+forecast+` GROUP BY b.alias ORDER BY max(b.orden)`);

		const queryCol13 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT ISNULL(Round(Sum(a.TOT),2),0) AS TOT FROM `+schema+`forecast_con_cc AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+forecast+` GROUP BY b.alias ORDER BY max(b.orden)`);

		const queryCol14 = pool.request().input('year', currentYear)
		.query(`SELECT Round(Max(tot),2) AS \'PRES\' FROM `+schema+`presupuestos_cc AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.periodo = @year GROUP BY b.alias ORDER BY max(b.orden)`);

		const queryCol17 = pool.request().input('year', currentYear)
		.query(`SELECT Round(Max(extraord),2) AS \'EXTR\' FROM `+schema+`total_zone_forecast_cc AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year GROUP BY b.alias ORDER BY max(b.orden)`);

		const queryCol18 = pool.request().input('year', currentYear - 2)
		.query(`SELECT ISNULL(Round(Sum(a.m2),2),0) AS \'TOTVR\' FROM `+schema+`budget_period_group AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND customer_type_id = 2 GROUP BY b.alias ORDER BY max(b.orden)`);

		const queryResults = await Promise.all([queryCol0, queryCol1, queryCol2, queryCol3, queryCol4, queryCol5, queryCol6, queryCol7, queryCol8, queryCol9, queryCol10, queryCol11, queryCol12, queryCol13, queryCol14, queryCol17, queryCol18]);

		
		for (let index = 0; index <= 20; index++) {
			if (index == 0) {
				const recordset = queryResults[0].recordset;
				recordset.forEach((record) => {
					reportData.push(record);
				});
			}else if (index < 14) {
				var recordset = queryResults[index].recordset;

				if (recordset.length == 0 && index == 1) {
					recordset = [{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0},{ ENE: 0}]
				}else if (recordset.length == 0 && index == 2) {
					recordset = [{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0},{ FEB: 0}]
				}else if (recordset.length == 0 && index == 3) {
					recordset = [{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0},{ MAR: 0}]
				}else if (recordset.length == 0 && index == 4) {
					recordset = [{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0},{ ABR: 0}]
				}else if (recordset.length == 0 && index == 5) {
					recordset = [{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0},{ MAY: 0}]
				}else if (recordset.length == 0 && index == 6) {
					recordset = [{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0},{ JUN: 0}]
				}else if (recordset.length == 0 && index == 7) {
					recordset = [{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0},{ JUL: 0}]
				}else if (recordset.length == 0 && index == 8) {
					recordset = [{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0},{ AGO: 0}]
				}else if (recordset.length == 0 && index == 9) {
					recordset = [{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0},{ SEP: 0}]
				}else if (recordset.length == 0 && index == 10) {
					recordset = [{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0},{ OCT: 0}]
				}else if (recordset.length == 0 && index == 11) {
					recordset = [{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0},{ NOV: 0}]
				}else if (recordset.length == 0 && index == 12) {
					recordset = [{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0},{ DIC: 0}]
				}else if (recordset.length == 0 && index == 13) {
					recordset = [{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0},{ TOT: 0}]
				}

				recordset.forEach((record, recordIndex) => {					
					const key = Object.keys(record)[0];
					reportData[recordIndex][key] = record[key];
				});

				console.log(recordset);

			} else if (index == 14 ) {
				const recordset = queryResults[index].recordset; 
				recordset.forEach((record, recordIndex) => {					
					const key = Object.keys(record)[0];
					reportData[recordIndex][key] = record[key];
				});
			} else if(index == 15) {
				reportData.forEach((reportRow, rowIndex) => {
					reportRow[`PorcCumpl${currentYear}`] = `=(N${rowIndex + 1}/O${rowIndex + 1})*100`;
				});
			} else if(index == 16) {
				reportData.forEach((reportRow, rowIndex) => {
					reportRow[`M2${currentYear}`] = `=O${rowIndex + 1}-N${rowIndex + 1}`;
				});
			} else if(index == 17) {
				const recordset = queryResults[15].recordset; 
				recordset.forEach((record, recordIndex) => {					
					const key = Object.keys(record)[0];
					reportData[recordIndex][key] = record[key];
				});
			} else if(index == 18) {
				const recordset = queryResults[16].recordset; 
				recordset.forEach((record, recordIndex) => {					
					const key = Object.keys(record)[0];
					reportData[recordIndex][key] = record[key];
				});
			} else if(index == 19) {
				reportData.forEach((reportRow, rowIndex) => {
					reportRow[`Crecimiento${currentYear - 2}`] = `=(N${rowIndex + 1}/S${rowIndex + 1})*100`;
				});
			}
		}
		res.status(200).json({reportData});
	} catch (error) {
		res.status(500).json({error});
	}
  },


reporte_entidad_consolidado: async (req, res) => {
	var forecast = req.param('forecast');
	const currentYear = new Date().getFullYear();
	try {
		const pool = await sql.connect(db_config); 
		const queryCol0 = pool.request().query('SELECT alias \'A - ProductLine\'FROM '+schema+'product_lines ORDER BY orden');

		const queryCol1 = pool.request().input('year', currentYear - 2)

		.query(`SELECT   Round(Sum(vr_year1), 2)  AS \'B - VR${currentYear-2}\'
				FROM    (
				                SELECT product_line,
				                       vr_year1
				                FROM   `+schema+`total_zone_forecast
				                WHERE  forecast = `+forecast+`
				                UNION ALL
				                SELECT product_line,
				                       vr_year1
				                FROM   `+schema+`total_zone_forecast_cc
				                WHERE  forecast = `+forecast+`) t,
				         `+schema+`product_lines p
				WHERE    t.product_line = p.product_line
				GROUP BY t.product_line
				ORDER BY max(p.orden)`);

		


		const queryCol2 = pool.request().input('year', currentYear - 1)

		/*.query(`SELECT SUM(A.m2) AS \'C - VR${currentYear - 1}\' FROM `+schema+`budget_period_group AS A 
				JOIN `+schema+`product_lines AS B ON A.product_line = B.product_line WHERE A.year = @year 
				GROUP BY B.alias ORDER by MAX(B.orden)`);*/

		.query(`SELECT   Round(Sum(vr_year2), 2)  AS \'C - VR${currentYear - 1}\' 
				FROM    (
				                SELECT product_line,
				                       vr_year2
				                FROM   `+schema+`total_zone_forecast
				                WHERE  forecast = `+forecast+`
				                UNION ALL
				                SELECT product_line,
				                       vr_year2
				                FROM   `+schema+`total_zone_forecast_cc
				                WHERE  forecast = `+forecast+`) t,
				         `+schema+`product_lines p
				WHERE    t.product_line = p.product_line
				GROUP BY t.product_line
				ORDER BY max(p.orden)`);

		const queryCol3 = pool.request().input('year', currentYear)
		.query(`SELECT Round(SUM(vr_year3), 2) \'VentaReal\' FROM( SELECT product_line, vr_year3 FROM `+schema+`total_zone_forecast WHERE forecast = `+forecast+` UNION ALL SELECT product_line, vr_year3 FROM `+schema+`total_zone_forecast_cc WHERE forecast = `+forecast+`) T, `+schema+`product_lines P WHERE T.product_line = P.product_line GROUP BY T.product_line ORDER BY MAX(P.orden)`);
		

		const queryCol4 = pool.request()
		.query(`SELECT SUM(extraord) \'E - Extraord\' FROM 
				(SELECT product_line, extraord FROM `+schema+`total_zone_forecast 
					WHERE forecast = `+forecast+`
					UNION ALL 
					SELECT product_line, extraord FROM `+schema+`total_zone_forecast_cc
					WHERE forecast = `+forecast+`) T, `+schema+`product_lines P
				WHERE T.product_line = P.product_line 
				GROUP BY T.product_line
				ORDER BY MAX(P.orden)`);
		const queryCol6 = pool.request()
		.query(`SELECT SUM(poyear) \'G - PresupOrg\' FROM 
				(SELECT product_line, poyear FROM `+schema+`total_zone_forecast 
					WHERE forecast = `+forecast+`
					UNION ALL 
					SELECT product_line, poyear FROM `+schema+`total_zone_forecast_cc
					WHERE forecast = `+forecast+`) T , `+schema+`product_lines P
				WHERE T.product_line = P.product_line 
				GROUP BY T.product_line
				ORDER BY MAX(P.orden)`);
		const queryCol8 = pool.request()
		.query(`SELECT SUM(proyyear) \'I - Proyectos${currentYear}\' FROM 
				(SELECT product_line, proyyear FROM `+schema+`total_zone_forecast 
					WHERE forecast = `+forecast+`
					UNION ALL 
					SELECT product_line, proyyear FROM `+schema+`total_zone_forecast_cc
					WHERE forecast = `+forecast+`) T, `+schema+`product_lines P
				WHERE T.product_line = P.product_line 
				GROUP BY T.product_line
				ORDER BY MAX(P.orden)`);
		const queryVentasRealesTotales = pool.request().input('year', currentYear)
		.query(`SELECT ROUND(SUM(A.m2),2) AS \'VentaReal\' FROM `+schema+`budget_period_group AS A JOIN `+schema+`product_lines AS B ON A.product_line = B.product_line WHERE A.year = @year GROUP BY B.alias ORDER by MAX(B.orden)`);
		const queryResults = await Promise.all([queryCol0, queryCol1, queryCol2, queryCol3, queryCol4, queryCol6, queryCol8, queryVentasRealesTotales]);
		
		res.status(200).json({reportData: extractReportResults(queryResults, currentYear)});
	} catch (error) {
		console.log(error);
		res.status(500).json({error});
	}
}, 


/*

reporte_entidad_zona_comercial: async (req, res) => {
	var forecast = req.query.forecast;
	const currentYear = new Date().getFullYear();
	const commercialZone = req.query.commercial_zone;
	try {
		const pool = await sql.connect(db_config); 
		const queryCol0 = pool.request().query('SELECT alias \'A - ProductLine\'FROM '+schema+'product_lines ORDER BY orden');
		const queryCol1 = pool.request().input('year', currentYear - 2).input('commercialZone', commercialZone)
		.query(`SELECT SUM(A.m2) AS \'B - VR${currentYear-2}\' FROM `+schema+`budget_period_group AS A 
				JOIN `+schema+`product_lines AS B ON A.product_line = B.product_line WHERE A.year = @year AND A.commercial_zone = @commercialZone 
				GROUP BY B.alias ORDER by MAX(B.orden)`);
		const queryCol2 = pool.request().input('year', currentYear - 1).input('commercialZone', commercialZone)
		.query(`SELECT SUM(A.m2) AS \'C - VR${currentYear - 1}\' FROM `+schema+`budget_period_group AS A 
				JOIN `+schema+`product_lines AS B ON A.product_line = B.product_line WHERE A.year = @year AND A.commercial_zone = @commercialZone 
				GROUP BY B.alias ORDER by MAX(B.orden)`);
		const queryCol3 = pool.request().input('year', currentYear).input('commercialZone', commercialZone)
		.query(`SELECT SUM(A.m2) AS \'D - VR${currentYear}\' FROM `+schema+`budget_period_group AS A 
				JOIN `+schema+`product_lines AS B ON A.product_line = B.product_line WHERE A.year = @year AND A.commercial_zone = @commercialZone 
				GROUP BY B.alias ORDER by MAX(B.orden)`);


		const queryCol4 = pool.request().input('commercialZone', commercialZone).input('forecast', forecast)
		.query(`SELECT SUM(extraord) \'E - Extraord\' FROM 
				(SELECT product_line, extraord FROM `+schema+`total_zone_forecast WHERE commercial_zone=@commercialZone AND forecast = @forecast
					UNION ALL 
					SELECT product_line, extraord FROM `+schema+`total_zone_forecast_cc WHERE forecast = @forecast) T, `+schema+`product_lines P
				WHERE T.product_line = P.product_line 
				GROUP BY T.product_line
				ORDER BY MAX(P.orden)`);
		const queryCol6 = pool.request().input('commercialZone', commercialZone).input('forecast', forecast)
		.query(`SELECT SUM(poyear) \'G - PresupOrg\' FROM 
				(SELECT product_line, poyear FROM `+schema+`total_zone_forecast WHERE commercial_zone=@commercialZone AND forecast = @forecast
					UNION ALL 
					SELECT product_line, poyear FROM `+schema+`total_zone_forecast_cc WHERE forecast = @forecast) T , `+schema+`product_lines P
				WHERE T.product_line = P.product_line 
				GROUP BY T.product_line
				ORDER BY MAX(P.orden)`);
		const queryCol8 = pool.request().input('commercialZone', commercialZone).input('forecast', forecast)
		.query(`SELECT SUM(proyyear) \'I - Proyectos${currentYear}\' FROM 
				(SELECT product_line, proyyear FROM `+schema+`total_zone_forecast WHERE commercial_zone=@commercialZone AND forecast = @forecast
					UNION ALL 
					SELECT product_line, proyyear FROM `+schema+`total_zone_forecast_cc WHERE forecast = @forecast) T, `+schema+`product_lines P
				WHERE T.product_line = P.product_line 
				GROUP BY T.product_line
				ORDER BY MAX(P.orden)`);
		const queryVentasRealesTotales = pool.request().input('year', currentYear)
		.query(`SELECT SUM(A.m2) AS \'VentaReal\' FROM `+schema+`budget_period_group AS A JOIN `+schema+`product_lines AS B ON A.product_line = B.product_line WHERE A.year = @year GROUP BY B.alias ORDER by MAX(B.orden)`);
		const queryResults = await Promise.all([queryCol0, queryCol1, queryCol2, queryCol3, queryCol4, queryCol6, queryCol8, queryVentasRealesTotales]);
		
		res.status(200).json({reportData: extractReportResults(queryResults, currentYear)});
	} catch (error) {
		console.log(error);
		res.status(500).json({error});
	}
}, 

*/

reporte_entidad_zona_comercial: async (req, res) => {
	var forecast = req.query.forecast;
	const currentYear = new Date().getFullYear();
	const commercialZone = req.query.commercial_zone;
	try {
		const pool = await sql.connect(db_config); 
		const queryCol0 = pool.request().query('SELECT alias \'A - ProductLine\'FROM '+schema+'product_lines ORDER BY orden');
		
		const queryCol1 = pool.request().input('year', currentYear).input('commercialZone', commercialZone)
		/*.query(`SELECT SUM(A.m2) AS \'B - VR${currentYear-2}\' FROM `+schema+`budget_period_group AS A 
				JOIN `+schema+`product_lines AS B ON A.product_line = B.product_line WHERE A.year = @year AND A.commercial_zone = @commercialZone 
				GROUP BY B.alias ORDER by MAX(B.orden)`);*/


		.query(`SELECT   Round(Sum(vr_year1), 2)  AS \'B - VR${currentYear-2}\'
				FROM    (
				                SELECT product_line,
				                       vr_year1
				                FROM   `+schema+`total_zone_forecast
				                WHERE  forecast = `+forecast+`
				                AND    year = @year
								AND    commercial_zone = @commercialZone) t,
				         `+schema+`product_lines p
				WHERE    t.product_line = p.product_line
				GROUP BY t.product_line
				ORDER BY max(p.orden)`);
		

		const queryCol2 = pool.request().input('year', currentYear).input('commercialZone', commercialZone)
		/*.query(`SELECT SUM(A.m2) AS \'C - VR${currentYear - 1}\' FROM `+schema+`budget_period_group AS A 
				JOIN `+schema+`product_lines AS B ON A.product_line = B.product_line WHERE A.year = @year AND A.commercial_zone = @commercialZone 
				GROUP BY B.alias ORDER by MAX(B.orden)`);*/

		.query(`SELECT   Round(Sum(vr_year2), 2)  AS \'C - VR${currentYear-1}\'
				FROM    (
				                SELECT product_line,
				                       vr_year2
				                FROM   `+schema+`total_zone_forecast
				                WHERE  forecast = `+forecast+`
				                AND    year = @year
								AND    commercial_zone = @commercialZone) t,
				         `+schema+`product_lines p
				WHERE    t.product_line = p.product_line
				GROUP BY t.product_line
				ORDER BY max(p.orden)`);
		

		const queryCol3 = pool.request().input('year', currentYear).input('commercialZone', commercialZone)
		/*.query(`SELECT SUM(A.m2) AS \'D - VR${currentYear}\' FROM `+schema+`budget_period_group AS A 
				JOIN `+schema+`product_lines AS B ON A.product_line = B.product_line WHERE A.year = @year AND A.commercial_zone = @commercialZone 
				GROUP BY B.alias ORDER by MAX(B.orden)`);*/

		.query(`SELECT   Round(Sum(vr_year3), 2)  AS \'D - VR${currentYear}\'
				FROM    (
				                SELECT product_line,
				                       vr_year3
				                FROM   `+schema+`total_zone_forecast
				                WHERE  forecast = `+forecast+`
				                AND    year = @year
								AND    commercial_zone = @commercialZone) t,
				         `+schema+`product_lines p
				WHERE    t.product_line = p.product_line
				GROUP BY t.product_line
				ORDER BY max(p.orden)`);


		const queryCol4 = pool.request().input('commercialZone', commercialZone).input('forecast', forecast)
		.query(`SELECT SUM(extraord) \'E - Extraord\' FROM 
				(SELECT product_line, extraord FROM `+schema+`total_zone_forecast WHERE commercial_zone=@commercialZone AND forecast = @forecast) T, `+schema+`product_lines P
				WHERE T.product_line = P.product_line 
				GROUP BY T.product_line
				ORDER BY MAX(P.orden)`);
		const queryCol6 = pool.request().input('commercialZone', commercialZone).input('forecast', forecast)
		.query(`SELECT SUM(poyear) \'G - PresupOrg\' FROM 
				(SELECT product_line, poyear FROM `+schema+`total_zone_forecast WHERE commercial_zone=@commercialZone AND forecast = @forecast) T , `+schema+`product_lines P
				WHERE T.product_line = P.product_line 
				GROUP BY T.product_line
				ORDER BY MAX(P.orden)`);
		const queryCol8 = pool.request().input('commercialZone', commercialZone).input('forecast', forecast)
		.query(`SELECT SUM(proyyear) \'I - Proyectos${currentYear}\' FROM 
				(SELECT product_line, proyyear FROM `+schema+`total_zone_forecast WHERE commercial_zone=@commercialZone AND forecast = @forecast) T, `+schema+`product_lines P
				WHERE T.product_line = P.product_line 
				GROUP BY T.product_line
				ORDER BY MAX(P.orden)`);
		const queryVentasRealesTotales = pool.request().input('year', currentYear)
		.query(`SELECT SUM(A.m2) AS \'VentaReal\' FROM `+schema+`budget_period_group AS A JOIN `+schema+`product_lines AS B ON A.product_line = B.product_line WHERE A.year = @year GROUP BY B.alias ORDER by MAX(B.orden)`);
		const queryResults = await Promise.all([queryCol0, queryCol1, queryCol2, queryCol3, queryCol4, queryCol6, queryCol8, queryVentasRealesTotales]);
		
		res.status(200).json({reportData: extractReportResults(queryResults, currentYear)});
	} catch (error) {
		console.log(error);
		res.status(500).json({error});
	}
}, 

reporte_entidad_cc: async (req, res) => {
	var forecast = req.param('forecast');
	const currentYear = new Date().getFullYear();
	try {
		const pool = await sql.connect(db_config); 
		const queryCol0 = pool.request().query('SELECT alias \'A - ProductLine\'FROM '+schema+'product_lines ORDER BY orden');
		const queryCol1 = pool.request().input('year', currentYear)
		
		/*.query(`SELECT SUM(A.m2) AS \'B - VR${currentYear-2}\' 
				FROM `+schema+`budget_period_group AS A 
				JOIN `+schema+`product_lines AS B ON A.product_line = B.product_line 
				WHERE A.year = @year AND A.customer_type_id = 2 
				GROUP BY B.alias ORDER by MAX(B.orden)`);*/

		.query(`SELECT   Round(Sum(vr_year1), 2)  AS \'B - VR${currentYear-2}\'
				FROM    (
				                SELECT product_line,
				                       vr_year1
				                FROM   `+schema+`total_zone_forecast_cc
				                WHERE  forecast = `+forecast+`
				                AND    year = @year) t,
				         `+schema+`product_lines p
				WHERE    t.product_line = p.product_line
				GROUP BY t.product_line
				ORDER BY max(p.orden)`);

		const queryCol2 = pool.request().input('year', currentYear)
		/*.query(`SELECT SUM(A.m2) AS \'C - VR${currentYear - 1}\' 
				FROM `+schema+`budget_period_group AS A 
				JOIN `+schema+`product_lines AS B ON A.product_line = B.product_line 
				WHERE A.year = @year AND A.customer_type_id = 2 
				GROUP BY B.alias ORDER by MAX(B.orden)`);*/

		.query(`SELECT   Round(Sum(vr_year2), 2)  AS \'C - VR${currentYear-1}\'
				FROM    (
				                SELECT product_line,
				                       vr_year2
				                FROM   `+schema+`total_zone_forecast_cc
				                WHERE  forecast = `+forecast+`
				                AND    year = @year) t,
				         `+schema+`product_lines p
				WHERE    t.product_line = p.product_line
				GROUP BY t.product_line
				ORDER BY max(p.orden)`);

		const queryCol3 = pool.request().input('year', currentYear)
		/*.query(`SELECT SUM(A.m2) AS \'D - VR${currentYear}\' 
				FROM `+schema+`budget_period_group AS A 
				JOIN `+schema+`product_lines AS B ON A.product_line = B.product_line 
				WHERE A.year = @year AND A.customer_type_id = 2 
				GROUP BY B.alias ORDER by MAX(B.orden)`);*/
		.query(`SELECT   Round(Sum(vr_year3), 2)  AS \'D - VR${currentYear}\'
				FROM    (
				                SELECT product_line,
				                       vr_year3
				                FROM   `+schema+`total_zone_forecast_cc
				                WHERE  forecast = `+forecast+`
				                AND    year = @year) t,
				         `+schema+`product_lines p
				WHERE    t.product_line = p.product_line
				GROUP BY t.product_line
				ORDER BY max(p.orden)`);

		const queryCol4 = pool.request()
		.query(`SELECT SUM(extraord) \'E - Extraord\' 
				FROM `+schema+`total_zone_forecast_cc T, `+schema+`product_lines P
				WHERE forecast = `+forecast+` AND T.product_line = P.product_line
				GROUP BY T.product_line
				ORDER BY MAX(P.orden)`);
		const queryCol6 = pool.request()
		.query(`SELECT SUM(poyear) \'G - PresupOrg\'  
				FROM `+schema+`total_zone_forecast_cc T, `+schema+`product_lines P
				WHERE forecast = `+forecast+` AND T.product_line = P.product_line
				GROUP BY T.product_line
				ORDER BY MAX(P.orden)`);
		const queryCol8 = pool.request()
		.query(`SELECT SUM(proyyear) \'I - Proyectos${currentYear}\'
				FROM `+schema+`total_zone_forecast_cc T, `+schema+`product_lines P
				WHERE forecast = `+forecast+` AND T.product_line = P.product_line
				GROUP BY T.product_line
				ORDER BY MAX(P.orden)`);
		const queryVentasRealesTotales = pool.request().input('year', currentYear)
		.query(`SELECT SUM(A.m2) AS \'VentaReal\' FROM `+schema+`budget_period_group AS A JOIN `+schema+`product_lines AS B ON A.product_line = B.product_line WHERE A.year = @year GROUP BY B.alias ORDER by MAX(B.orden)`);
		const queryResults = await Promise.all([queryCol0, queryCol1, queryCol2, queryCol3, queryCol4, queryCol6, queryCol8, queryVentasRealesTotales]);
		
		res.status(200).json({reportData: extractReportResults(queryResults, currentYear)});
	} catch (error) {
		console.log(error);
		res.status(500).json({error});
	}
},


/*
reporte_resumen_cc: async (req, res) => {

  	var forecast = req.param('forecast');

  	let reportData = [];
	const currentYear = new Date().getFullYear();
	try {
		const pool = await sql.connect(db_config); 

		const queryCol0 = pool.request().query('SELECT alias FROM '+schema+'product_lines ORDER BY alias');

		

		const queryCol1 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT Round(Sum(a.ene), 2) AS ENE FROM `+schema+`forecast_con_cc AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+ forecast +` GROUP BY b.alias`);

		const queryCol2 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT Round(Sum(a.feb), 2) AS FEB FROM `+schema+`forecast_con_cc AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+ forecast +` GROUP BY b.alias `);
		
		const queryCol3 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT Round(Sum(a.MAR), 2) AS MAR FROM `+schema+`forecast_con_cc AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+ forecast +` GROUP BY b.alias `);
		
		const queryCol4 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT Round(Sum(a.ABR), 2) AS ABR FROM `+schema+`forecast_con_cc AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+ forecast +` GROUP BY b.alias `);

		const queryCol5 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT Round(Sum(a.MAY), 2) AS MAY FROM `+schema+`forecast_con_cc AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+ forecast +` GROUP BY b.alias `);

		const queryCol6 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT Round(Sum(a.JUN), 2) AS JUN FROM `+schema+`forecast_con_cc AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+ forecast +` GROUP BY b.alias `);

		const queryCol7 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT Round(Sum(a.JUL), 2) AS JUL FROM `+schema+`forecast_con_cc AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+ forecast +` GROUP BY b.alias `);

		const queryCol8 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT Round(Sum(a.AGO), 2) AS AGO FROM `+schema+`forecast_con_cc AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+ forecast +` GROUP BY b.alias `);


		const queryCol9 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT Round(Sum(a.SEP), 2) AS SEP FROM `+schema+`forecast_con_cc AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+ forecast +` GROUP BY b.alias `);

		const queryCol10 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT Round(Sum(a.OCT), 2) AS OCT FROM `+schema+`forecast_con_cc AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+ forecast +` GROUP BY b.alias `);

		const queryCol11 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT Round(Sum(a.NOV), 2) AS NOV FROM `+schema+`forecast_con_cc AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+ forecast +` GROUP BY b.alias `);

		const queryCol12 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT Round(Sum(a.DIC), 2) AS DIC FROM `+schema+`forecast_con_cc AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+ forecast +` GROUP BY b.alias `);

		const queryCol13 = pool.request().input('year', currentYear).input('forecast', forecast)
		.query(`SELECT Round(Sum(a.TOT), 2) AS TOT FROM `+schema+`forecast_con_cc AS a JOIN `+schema+`product_lines AS b ON a.product_line = b.product_line WHERE a.year = @year AND forecast = `+ forecast +` GROUP BY b.alias `);

		const queryCol14 = pool.request().input('year', currentYear)
		.query(`SELECT ROUND(MAX(tot),2) AS \'PRES\' FROM `+schema+`presupuestos AS A JOIN `+schema+`product_lines AS B ON A.product_line = B.product_line WHERE A.periodo = @year AND commercial_zone = '`+commercial_zone+`' GROUP BY B.alias` );

		const queryCol17 = pool.request().input('year', currentYear)
		.query(`SELECT ROUND(MAX(extraord),2) AS \'EXTR\' FROM `+schema+`total_zone_forecast AS A JOIN `+schema+`product_lines AS B ON A.product_line = B.product_line WHERE A.year = @year AND commercial_zone = '`+commercial_zone+`' GROUP BY B.alias`);

		const queryCol18 = pool.request().input('year', currentYear - 2)
		.query(`SELECT ROUND(SUM(A.m2),2) AS \'TOTVR\' FROM `+schema+`budget_period_group AS A JOIN `+schema+`product_lines AS B ON A.product_line = B.product_line WHERE A.year = @year AND commercial_zone = '`+commercial_zone+`' GROUP BY B.alias`);

		

		const queryResults = await Promise.all([queryCol0, queryCol1, queryCol2, queryCol3, queryCol4, queryCol5, queryCol6, queryCol7, queryCol8, queryCol9, queryCol10, queryCol11, queryCol12, queryCol13, queryCol14, queryCol17, queryCol18]);

		
		for (let index = 0; index <= 20; index++) {
			if (index == 0) {
				const recordset = queryResults[0].recordset;
				recordset.forEach((record) => {
					reportData.push(record);
				});
			} else if (index < 15 ) {
				const recordset = queryResults[index].recordset; 
				recordset.forEach((record, recordIndex) => {					
					const key = Object.keys(record)[0];
					reportData[recordIndex][key] = record[key];
				});
			} else if(index == 15) {
				reportData.forEach((reportRow, rowIndex) => {
					reportRow[`PorcCumpl${currentYear}`] = `=(O${rowIndex + 1}/N${rowIndex + 1})*100`;
				});
			} else if(index == 16) {
				reportData.forEach((reportRow, rowIndex) => {
					reportRow[`M2${currentYear}`] = `=O${rowIndex + 1}-N${rowIndex + 1}`;
				});
			} else if(index == 17) {
				const recordset = queryResults[15].recordset; 
				recordset.forEach((record, recordIndex) => {					
					const key = Object.keys(record)[0];
					reportData[recordIndex][key] = record[key];
				});
			} else if(index == 18) {
				const recordset = queryResults[16].recordset; 
				recordset.forEach((record, recordIndex) => {					
					const key = Object.keys(record)[0];
					reportData[recordIndex][key] = record[key];
				});
			} else if(index == 19) {
				reportData.forEach((reportRow, rowIndex) => {
					reportRow[`Crecimiento${currentYear - 2}`] = `=(N${rowIndex + 1}/S${rowIndex + 1})*100`;
				});
			}
		}
		res.status(200).json({reportData});
	} catch (error) {
		res.status(500).json({error});
	}
  },

*/

};
	
const extractReportResults = (queryResults, currentYear) => {
	let reportData = [];
  	for (let index = 0; index <= 12; index++) {
		if (index == 0) {	
			const recordset = queryResults[0].recordset;
			recordset.forEach((record) => {
				reportData.push(record);
			});
		} else if (index < 5) {
			const recordset = queryResults[index].recordset; 
			recordset.forEach((record, recordIndex) => {					
				const key = Object.keys(record)[0];
				reportData[recordIndex][key] = record[key];
			});
		} else if (index == 5) {
			reportData.forEach((reportRow, rowIndex) => {
				reportRow[`F - ${currentYear}Base`] = `=D${rowIndex + 1} - E${rowIndex + 1}`;
			});
		} else if (index == 7) {
			reportData.forEach((reportRow, rowIndex) => {
				reportRow['H - PorcentajeCrecimiento'] = `=(G${rowIndex + 1}/F${rowIndex + 1} - 1)*100`;
			});
		} else if (index == 9) {
			reportData.forEach((reportRow, rowIndex) => {
				reportRow[`J - Presupuesto${currentYear}ConProyectos`] = `=G${rowIndex + 1} +I${rowIndex + 1}`;
			});
		} else if(index == 10) {
			reportData.forEach((reportRow, rowIndex) => {
				reportRow[`K - PorcentajeCrecPresupuesto${currentYear}vsF${currentYear-1}`] = `=(J${rowIndex + 1}/D${rowIndex + 1} - 1)*100`;
			});
		} else if(index == 11) {
			reportData.forEach((reportRow, rowIndex) => {
				reportRow[`L - Presupuesto${currentYear}vsF${currentYear - 1}m2`] = `=J${rowIndex + 1} - D${rowIndex + 1}`;
			});
		} else if(index == 12) {
			const recordset = queryResults[7].recordset; 
			recordset.forEach((record, recordIndex) => {
				const ventaReal = record[Object.keys(record)[0]];
				reportData[recordIndex][`O - Part%${currentYear}F`] = `0`;
			});
		} else {
			let resultIndex;
			switch (index) {
				case 6:
					resultIndex = 5;
					console.log(resultIndex);

					break;
				case 8:
					resultIndex = 6;
					break;
				default:
					break;
			}

			const recordset = queryResults[resultIndex].recordset;
			recordset.forEach((record, recordIndex) => {					
				const key = Object.keys(record)[0];
				const value = record[key] == null ? 0 : record[key];
				reportData[recordIndex][key] = value;
			});
		}
	}
	return reportData
}




	