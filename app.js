var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
bodyParser = require('body-parser');
var logger = require('morgan');
const cors = require('cors')

const jwt = require('jsonwebtoken');
const config = require('./configs/config');

var dataBase = require('./routes/database');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();


app.use(cors());

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

// *********************** TOKEN ***********************************//
app.set('llave', config.llave);

// 2
app.use(bodyParser.urlencoded({ extended: true }));
// 3
app.use(bodyParser.json({type: 'application/json'}));




// ********************************************************************//

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.all("/*", function (req, res, next) {

     res.header("Access-Control-Allow-Origin", req.headers.origin);
     res.header("Access-Control-Allow-Credentials",true);
     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
     res.header('Access-Control-Allow-Headers', 'Content-Type,Accept,X-Access-Token,X-Key,Authorization,X-Requested-With,Origin,Access-Control-Allow-Origin,Access-Control-Allow-Credentials');
     if (req.method === 'OPTIONS') {
       res.status(200).end();
     } else {
       next();
     }
});


var auth = function(req, res, next) {
  if (req.session && req.session.admin)
    return next();
  else
    return res.sendStatus(401);
};

app.get('/content', auth, function (req, res) {

    res.send("You can only see this after you've logged in.");
});


const rutasProtegidas = express.Router();

rutasProtegidas.use((req, res, next) => {
    const token = req.headers['access-token'];
 
    if (token) {
      jwt.verify(token, app.get('llave'), (err, decoded) => {      
        if (err) {
          return res.json({ tkn: 404 });
        } else {
          req.decoded = decoded;    
          next();
        }
      });
    } else {
      res.json({ tkn: 404 });
    }
 });



//app.get('/suma_enero_2020', rutasProtegidas, dataBase.suma_enero_2020);

app.post('/autenticar', dataBase.autenticar);

app.get('/get_producto_distinct', rutasProtegidas, dataBase.get_producto);

app.get('/get_customer_name', rutasProtegidas, dataBase.get_customer_name);

app.get('/get_customer_id', rutasProtegidas, dataBase.get_customer_id);

app.get('/get_meses_by_product', rutasProtegidas, dataBase.get_meses_by_product);

app.get('/get_budget_period_by_year', rutasProtegidas, dataBase.get_budget_period_by_year);
app.get('/get_product_lines', rutasProtegidas, dataBase.get_product_lines);
app.get('/get_all_product_lines', rutasProtegidas, dataBase.get_all_product_lines);
app.get('/get_orden_product_line', rutasProtegidas, dataBase.get_orden_product_line);
app.get('/get_count_product_lines', rutasProtegidas, dataBase.get_count_product_lines);

/* Meses Forecast*/
app.get('/get_budget_period_by_year_forecast_12_cc', rutasProtegidas, dataBase.get_budget_period_by_year_forecast_12_cc);
app.get('/get_budget_period_by_year_forecast_11_cc', rutasProtegidas, dataBase.get_budget_period_by_year_forecast_11_cc);
app.get('/get_budget_period_by_year_forecast_10_cc', rutasProtegidas, dataBase.get_budget_period_by_year_forecast_10_cc);
app.get('/get_budget_period_by_year_forecast_9_cc', rutasProtegidas, dataBase.get_budget_period_by_year_forecast_9_cc);
app.get('/get_budget_period_by_year_forecast_8_cc', rutasProtegidas, dataBase.get_budget_period_by_year_forecast_8_cc);
app.get('/get_budget_period_by_year_forecast_7_cc', rutasProtegidas, dataBase.get_budget_period_by_year_forecast_7_cc);
app.get('/get_budget_period_by_year_forecast_6_cc', rutasProtegidas, dataBase.get_budget_period_by_year_forecast_6_cc);
app.get('/get_budget_period_by_year_forecast_5_cc', rutasProtegidas, dataBase.get_budget_period_by_year_forecast_5_cc);
app.get('/get_budget_period_by_year_forecast_4_cc', rutasProtegidas, dataBase.get_budget_period_by_year_forecast_4_cc);
app.get('/get_budget_period_by_year_forecast_3_cc', rutasProtegidas, dataBase.get_budget_period_by_year_forecast_3_cc);
app.get('/get_budget_period_by_year_forecast_2_cc', rutasProtegidas, dataBase.get_budget_period_by_year_forecast_2_cc);
app.get('/get_budget_period_by_year_forecast_1_cc', rutasProtegidas, dataBase.get_budget_period_by_year_forecast_1_cc);

app.get('/get_budget_period_by_year_forecast_12', rutasProtegidas, dataBase.get_budget_period_by_year_forecast_12);
app.get('/get_budget_period_by_year_forecast_11', rutasProtegidas, dataBase.get_budget_period_by_year_forecast_11);
app.get('/get_budget_period_by_year_forecast_10', rutasProtegidas, dataBase.get_budget_period_by_year_forecast_10);
app.get('/get_budget_period_by_year_forecast_9', rutasProtegidas, dataBase.get_budget_period_by_year_forecast_9);
app.get('/get_budget_period_by_year_forecast_8', rutasProtegidas, dataBase.get_budget_period_by_year_forecast_8);
app.get('/get_budget_period_by_year_forecast_7', rutasProtegidas, dataBase.get_budget_period_by_year_forecast_7);
app.get('/get_budget_period_by_year_forecast_6', rutasProtegidas, dataBase.get_budget_period_by_year_forecast_6);
app.get('/get_budget_period_by_year_forecast_5', rutasProtegidas, dataBase.get_budget_period_by_year_forecast_5);
app.get('/get_budget_period_by_year_forecast_4', rutasProtegidas, dataBase.get_budget_period_by_year_forecast_4);
app.get('/get_budget_period_by_year_forecast_3', rutasProtegidas, dataBase.get_budget_period_by_year_forecast_3);
app.get('/get_budget_period_by_year_forecast_2', rutasProtegidas, dataBase.get_budget_period_by_year_forecast_2);
app.get('/get_budget_period_by_year_forecast_1', rutasProtegidas, dataBase.get_budget_period_by_year_forecast_1);

app.get('/get_budget_period_last_month_forecast_12', rutasProtegidas, dataBase.get_budget_period_last_month_forecast_12);
app.get('/get_budget_period_last_month_forecast_11', rutasProtegidas, dataBase.get_budget_period_last_month_forecast_11);
app.get('/get_budget_period_last_month_forecast_10', rutasProtegidas, dataBase.get_budget_period_last_month_forecast_10);
app.get('/get_budget_period_last_month_forecast_9', rutasProtegidas, dataBase.get_budget_period_last_month_forecast_9);
app.get('/get_budget_period_last_month_forecast_8', rutasProtegidas, dataBase.get_budget_period_last_month_forecast_8);
app.get('/get_budget_period_last_month_forecast_7', rutasProtegidas, dataBase.get_budget_period_last_month_forecast_7);
app.get('/get_budget_period_last_month_forecast_6', rutasProtegidas, dataBase.get_budget_period_last_month_forecast_6);
app.get('/get_budget_period_last_month_forecast_5', rutasProtegidas, dataBase.get_budget_period_last_month_forecast_5);
app.get('/get_budget_period_last_month_forecast_4', rutasProtegidas, dataBase.get_budget_period_last_month_forecast_4);
app.get('/get_budget_period_last_month_forecast_3', rutasProtegidas, dataBase.get_budget_period_last_month_forecast_3);
app.get('/get_budget_period_last_month_forecast_2', rutasProtegidas, dataBase.get_budget_period_last_month_forecast_2);

app.get('/get_budget_period_last_month_forecast_12_cc', rutasProtegidas, dataBase.get_budget_period_last_month_forecast_12_cc);
app.get('/get_budget_period_last_month_forecast_11_cc', rutasProtegidas, dataBase.get_budget_period_last_month_forecast_11_cc);
app.get('/get_budget_period_last_month_forecast_10_cc', rutasProtegidas, dataBase.get_budget_period_last_month_forecast_10_cc);
app.get('/get_budget_period_last_month_forecast_9_cc', rutasProtegidas, dataBase.get_budget_period_last_month_forecast_9_cc);
app.get('/get_budget_period_last_month_forecast_8_cc', rutasProtegidas, dataBase.get_budget_period_last_month_forecast_8_cc);
app.get('/get_budget_period_last_month_forecast_7_cc', rutasProtegidas, dataBase.get_budget_period_last_month_forecast_7_cc);
app.get('/get_budget_period_last_month_forecast_6_cc', rutasProtegidas, dataBase.get_budget_period_last_month_forecast_6_cc);
app.get('/get_budget_period_last_month_forecast_5_cc', rutasProtegidas, dataBase.get_budget_period_last_month_forecast_5_cc);
app.get('/get_budget_period_last_month_forecast_4_cc', rutasProtegidas, dataBase.get_budget_period_last_month_forecast_4_cc);
app.get('/get_budget_period_last_month_forecast_3_cc', rutasProtegidas, dataBase.get_budget_period_last_month_forecast_3_cc);
app.get('/get_budget_period_last_month_forecast_2_cc', rutasProtegidas, dataBase.get_budget_period_last_month_forecast_2_cc);

app.get('/check_if_exist_forecast_con_cc', rutasProtegidas, dataBase.check_if_exist_forecast_con_cc);
app.get('/check_if_exist_forecast', rutasProtegidas, dataBase.check_if_exist_forecast);
app.get('/get_forecast_by_year', rutasProtegidas, dataBase.get_forecast_by_year);
app.get('/get_exist_forecast_by_year', rutasProtegidas, dataBase.get_exist_forecast_by_year);
/* End Meses */

app.get('/get_budget_period_percent_by_year', rutasProtegidas, dataBase.get_budget_period_percent_by_year);

app.get('/get_budget_period_percent_last_three_year', rutasProtegidas, dataBase.get_budget_period_percent_last_three_year);

app.get('/get_budget_period_q', rutasProtegidas, dataBase.get_budget_period_q);
app.get('/get_forecast_q', rutasProtegidas, dataBase.get_forecast_q);

app.get('/get_product_lines_by_period', rutasProtegidas, dataBase.get_product_lines_by_period);

app.get('/get_subfamily_by_product_line', rutasProtegidas, dataBase.get_subfamily_by_product_line);

app.get('/get_data_paso_tres', rutasProtegidas, dataBase.get_data_paso_tres);

app.get('/get_paso3_e', rutasProtegidas, dataBase.get_paso3_e);
app.get('/get_paso3_e_forecast', rutasProtegidas, dataBase.get_paso3_e_forecast);

app.get('/get_paso3_e_cc', rutasProtegidas, dataBase.get_paso3_e_cc);

app.get('/get_paso3_e_forecast_cc', rutasProtegidas, dataBase.get_paso3_e_forecast_cc);

app.get('/get_poyear', rutasProtegidas, dataBase.get_poyear);

app.get('/get_tot_by_year', rutasProtegidas, dataBase.get_tot_by_year);

app.get('/get_data_vr_paso_4_cc', rutasProtegidas, dataBase.get_data_vr_paso_4_cc);
app.get('/get_data_vr_forecast_paso_4', rutasProtegidas, dataBase.get_data_vr_forecast_paso_4);

app.get('/get_data_vr_paso_4', rutasProtegidas, dataBase.get_data_vr_paso_4);

app.get('/get_data_seller_paso_4_cc', rutasProtegidas, dataBase.get_data_seller_paso_4_cc);

app.get('/get_existing_data_seller_bypd_paso_4_cc', rutasProtegidas, dataBase.get_existing_data_seller_bypd_paso_4_cc);

app.get('/get_existing_data_seller_bypd_paso_4', rutasProtegidas, dataBase.get_existing_data_seller_bypd_paso_4);
app.get('/get_existing_data_seller_bypd_paso_4_forecast', rutasProtegidas, dataBase.get_existing_data_seller_bypd_paso_4_forecast);

app.get('/get_total_paso_4_cc', rutasProtegidas, dataBase.get_total_paso_4_cc);
app.get('/get_total_paso_4', rutasProtegidas, dataBase.get_total_paso_4);
app.get('/get_data_seller_bypd_paso_4_cc', rutasProtegidas, dataBase.get_data_seller_bypd_paso_4_cc);
app.get('/get_data_seller_forecast_bypd_paso_4', rutasProtegidas, dataBase.get_data_seller_forecast_bypd_paso_4);

app.get('/get_venta_by_tienda', rutasProtegidas, dataBase.get_venta_by_tienda);
app.get('/get_venta_by_customer', rutasProtegidas, dataBase.get_venta_by_customer);

app.get('/get_data_seller_bypd_paso_4', rutasProtegidas, dataBase.get_data_seller_bypd_paso_4);

app.get('/get_data_tiendas_seller_bypd_paso_5_cc', rutasProtegidas, dataBase.get_data_tiendas_seller_bypd_paso_5_cc);

app.get('/get_existing_data_tiendas_seller_bypd_paso_5_cc', rutasProtegidas, dataBase.get_existing_data_tiendas_seller_bypd_paso_5_cc);

app.get('/get_data_tiendas_seller_bypd_paso_5', rutasProtegidas, dataBase.get_data_tiendas_seller_bypd_paso_5);
app.get('/get_data_tiendas_seller_bypd_paso_5_forecast', rutasProtegidas, dataBase.get_data_tiendas_seller_bypd_paso_5_forecast);

app.get('/get_existing_data_tiendas_seller_bypd_paso_5', rutasProtegidas, dataBase.get_existing_data_tiendas_seller_bypd_paso_5);

app.get('/get_product_lines_by_seller_cc', rutasProtegidas, dataBase.get_product_lines_by_seller_cc);

app.get('/get_product_lines_by_seller', rutasProtegidas, dataBase.get_product_lines_by_seller);
app.get('/get_product_lines_by_seller_forecast', rutasProtegidas, dataBase.get_product_lines_by_seller_forecast);

app.get('/get_sellers_cc', rutasProtegidas, dataBase.get_sellers_cc);

app.get('/get_sellers', rutasProtegidas, dataBase.get_sellers);

app.get('/get_sellers_tienda_cc', rutasProtegidas, dataBase.get_sellers_tienda_cc);

app.get('/get_tiendas_by_seller_cid_cc',rutasProtegidas, dataBase.get_tiendas_by_seller_cid_cc);

app.get('/get_customers_by_seller',rutasProtegidas, dataBase.get_customers_by_seller);
app.get('/get_customers_by_seller_forecast',rutasProtegidas, dataBase.get_customers_by_seller_forecast);

app.get('/get_tiendas_nuevas_cc', rutasProtegidas, dataBase.get_tiendas_nuevas_cc);

app.get('/get_tiendas_cerradas_cc', rutasProtegidas, dataBase.get_tiendas_cerradas_cc);

app.get('/get_pl_tiendas_nuevas_cc', rutasProtegidas, dataBase.get_pl_tiendas_nuevas_cc);

app.get('/get_monto_mensual_tiendas_nuevas_cc', rutasProtegidas, dataBase.get_monto_mensual_tiendas_nuevas_cc);

app.get('/get_forecast_status', rutasProtegidas, dataBase.get_forecast_status);

app.put('/accion_ajustar_tienda_nueva_cc', rutasProtegidas, dataBase.accion_ajustar_tienda_nueva_cc);

app.put('/put_average_three_years', rutasProtegidas, dataBase.put_average_three_years);

app.put('/put_average_three_years_macrolux', rutasProtegidas, dataBase.put_average_three_years_macrolux);

app.put('/put_average_three_years_macrolux_corrugado', rutasProtegidas, dataBase.put_average_three_years_macrolux_corrugado);

app.put('/put_budget_period_by_year', rutasProtegidas, dataBase.put_budget_period_by_year);

app.put('/put_budget_period_by_year_macrolux', rutasProtegidas, dataBase.put_budget_period_by_year_macrolux);

app.put('/put_budget_period_by_year_macrolux_corrugado', rutasProtegidas, dataBase.put_budget_period_by_year_macrolux_corrugado);

app.put('/put_budgetperiod_closed_by_zone', rutasProtegidas, dataBase.put_budgetperiod_closed_by_zone);

app.put('/put_forecast_closed_by_zone', rutasProtegidas, dataBase.put_forecast_closed_by_zone);

app.put('/update_vr1', rutasProtegidas, dataBase.update_vr1);

app.put('/update_vr1_cc', rutasProtegidas, dataBase.update_vr1_cc);

app.put('/put_apportionment_period_closed_by_zone', rutasProtegidas, dataBase.put_apportionment_period_closed_by_zone);

app.put('/put_total_zone_budget_period', rutasProtegidas, dataBase.put_total_zone_budget_period);

app.put('/cerrar_forecast', rutasProtegidas, dataBase.cerrar_forecast);

app.put('/accion_ajuste_por_tienda_cerrada_cc', rutasProtegidas, dataBase.accion_ajuste_por_tienda_cerrada_cc);

app.delete('/delete_post_ajuste_tienda_nueva_cc', rutasProtegidas, dataBase.delete_post_ajuste_tienda_nueva_cc);

app.delete('/delete_post_ajuste_tienda_cerrada_cc', rutasProtegidas, dataBase.delete_post_ajuste_tienda_cerrada_cc);

app.delete('/delete_budget_period_cc', rutasProtegidas, dataBase.delete_budget_period_cc);

app.delete('/delete_budget_period', rutasProtegidas, dataBase.delete_budget_period);

app.delete('/delete_total_zone_budget_period_cc', rutasProtegidas, dataBase.delete_total_zone_budget_period_cc);
app.delete('/delete_total_zone_forecast_cc', rutasProtegidas, dataBase.delete_total_zone_forecast_cc);
app.delete('/delete_total_zone_forecast', rutasProtegidas, dataBase.delete_total_zone_forecast);

app.delete('/delete_total_zone_budget_period', rutasProtegidas, dataBase.delete_total_zone_budget_period);

app.delete('/delete_budget_next_year_cc', rutasProtegidas, dataBase.delete_budget_next_year_cc);
app.delete('/delete_forecast_next_year', rutasProtegidas, dataBase.delete_forecast_next_year);

app.delete('/delete_budget_next_year', rutasProtegidas, dataBase.delete_budget_next_year);

app.delete('/delete_apportionment_period_closed_by_zone_cc', rutasProtegidas, dataBase.delete_apportionment_period_closed_by_zone_cc);
app.delete('/delete_forecast_apportionment_period_closed_by_zone_cc', rutasProtegidas, dataBase.delete_forecast_apportionment_period_closed_by_zone_cc);

app.delete('/delete_apportionment_period_closed_by_zone', rutasProtegidas, dataBase.delete_apportionment_period_closed_by_zone);
app.delete('/delete_forecast_apportionment_period_closed_by_zone', rutasProtegidas, dataBase.delete_forecast_apportionment_period_closed_by_zone);

app.delete('/delete_data_seller_bypd_paso_4_cc', rutasProtegidas, dataBase.delete_data_seller_bypd_paso_4_cc);

app.delete('/delete_data_seller_bypd_paso_4', rutasProtegidas, dataBase.delete_data_seller_bypd_paso_4);
app.delete('/delete_data_seller_bypd_paso_4_forecast', rutasProtegidas, dataBase.delete_data_seller_bypd_paso_4_forecast);

app.delete('/delete_data_seller_bypd_paso_5_cc', rutasProtegidas, dataBase.delete_data_seller_bypd_paso_5_cc);

app.delete('/delete_data_seller_bypd_paso_5_forecast', rutasProtegidas, dataBase.delete_data_seller_bypd_paso_5_forecast);
app.delete('/delete_data_seller_bypd_paso_5', rutasProtegidas, dataBase.delete_data_seller_bypd_paso_5);


/////// Ctas Clave ///////

app.get('/get_name_seller', rutasProtegidas, dataBase.get_name_seller);
app.get('/get_tienda_byname', rutasProtegidas, dataBase.get_tienda_byname);

app.get('/get_cuentas_clave', rutasProtegidas, dataBase.get_cuentas_clave);
app.get('/check_cuentas_clave', rutasProtegidas, dataBase.check_cuentas_clave);
app.get('/get_budget_period_by_year_1_cc', rutasProtegidas, dataBase.get_budget_period_by_year_1_cc);
app.get('/get_budget_period_by_year_1_all_cc', rutasProtegidas, dataBase.get_budget_period_by_year_1_all_cc);
app.get('/get_tot_by_year_cc', rutasProtegidas, dataBase.get_tot_by_year_cc);
app.get('/get_tot_by_year_all_cc', rutasProtegidas, dataBase.get_tot_by_year_all_cc);
app.get('/check_if_exist_con', rutasProtegidas, dataBase.check_if_exist_con);
app.get('/check_if_exist_forecast_con', rutasProtegidas, dataBase.check_if_exist_forecast_con);
app.get('/check_if_exist_con_cc', rutasProtegidas, dataBase.check_if_exist_con_cc);
app.get('/check_if_exist_forecast_con_cc', rutasProtegidas, dataBase.check_if_exist_forecast_con_cc);
app.get('/check_if_exist_apportionment_cc', rutasProtegidas, dataBase.check_if_exist_apportionment_cc);
app.get('/check_if_exist_forecast_apportionment', rutasProtegidas, dataBase.check_if_exist_forecast_apportionment);
app.get('/check_if_exist_forecast_apportionment_cc', rutasProtegidas, dataBase.check_if_exist_forecast_apportionment_cc);
app.get('/check_if_exist_apportionment', rutasProtegidas, dataBase.check_if_exist_apportionment);
app.get('/check_if_exist_total_budget_cc', rutasProtegidas, dataBase.check_if_exist_total_budget_cc);
app.get('/check_if_exist_forecast_total_budget_cc', rutasProtegidas, dataBase.check_if_exist_forecast_total_budget_cc);

app.get('/check_if_exist_total_budget', rutasProtegidas, dataBase.check_if_exist_total_budget);
app.get('/check_if_exist_seller_by_line', rutasProtegidas, dataBase.check_if_exist_seller_by_line);
app.get('/check_if_exist_seller_by_line_forecast', rutasProtegidas, dataBase.check_if_exist_seller_by_line_forecast);
app.get('/check_if_exist_seller_by_line_cc', rutasProtegidas, dataBase.check_if_exist_seller_by_line_cc);
app.get('/check_if_exist_entregable', rutasProtegidas, dataBase.check_if_exist_entregable);
app.get('/check_if_exist_entregable_forecast', rutasProtegidas, dataBase.check_if_exist_entregable_forecast);

app.get('/get_existing_entregable_forecast', rutasProtegidas, dataBase.get_existing_entregable_forecast);
app.get('/get_presupuesto', rutasProtegidas, dataBase.get_presupuesto);
app.get('/get_presupuesto_cc', rutasProtegidas, dataBase.get_presupuesto_cc);
app.get('/get_presupuesto_by_line', rutasProtegidas, dataBase.get_presupuesto_by_line);
app.get('/get_presupuesto_by_line_cc', rutasProtegidas, dataBase.get_presupuesto_by_line_cc);

app.get('/check_if_exist_entregable_cc', rutasProtegidas, dataBase.check_if_exist_entregable_cc);
app.get('/get_existing_apportionment_data_cc', rutasProtegidas, dataBase.get_existing_apportionment_data_cc);
app.get('/get_existing_forecast_apportionment_data', rutasProtegidas, dataBase.get_existing_forecast_apportionment_data);

app.get('/get_existing_forecast_apportionment_data_cc', rutasProtegidas, dataBase.get_existing_forecast_apportionment_data_cc);
app.get('/get_existing_apportionment_data', rutasProtegidas, dataBase.get_existing_apportionment_data);
app.get('/get_budget_period_percent_by_year_cc', rutasProtegidas, dataBase.get_budget_period_percent_by_year_cc);
app.get('/get_budget_period_percent_by_year_all_cc', rutasProtegidas, dataBase.get_budget_period_percent_by_year_all_cc);
app.get('/get_budget_period_q_cc', rutasProtegidas, dataBase.get_budget_period_q_cc);
app.get('/get_percents_p1_cc', rutasProtegidas, dataBase.get_percents_p1_cc);
app.get('/get_percents_forecast_p1_cc', rutasProtegidas, dataBase.get_percents_forecast_p1_cc);
app.get('/get_percents_forecast_p1', rutasProtegidas, dataBase.get_percents_forecast_p1);
app.get('/get_budget_period_qp1_cc', rutasProtegidas, dataBase.get_budget_period_qp1_cc);
app.get('/get_forecast_qp1_cc', rutasProtegidas, dataBase.get_forecast_qp1_cc);
app.get('/get_trimestral_budget_period_cc', rutasProtegidas, dataBase.get_trimestral_budget_period_cc);
app.get('/get_trimestral_forecast_budget_period_cc', rutasProtegidas, dataBase.get_trimestral_forecast_budget_period_cc);
app.get('/get_trimestral_forecast_budget_period', rutasProtegidas, dataBase.get_trimestral_forecast_budget_period);
app.put('/put_budget_period_closed_by_zone_cc', rutasProtegidas, dataBase.put_budget_period_closed_by_zone_cc);
app.put('/put_forecast_closed_by_zone_cc', rutasProtegidas, dataBase.put_forecast_closed_by_zone_cc);
app.delete('/delete_forecast_cc', rutasProtegidas, dataBase.delete_forecast_cc);
app.delete('/delete_forecast', rutasProtegidas, dataBase.delete_forecast);

app.put('/put_apportionment_period_closed_by_zone_cc', rutasProtegidas, dataBase.put_apportionment_period_closed_by_zone_cc);
app.put('/put_apportionment_forecast_period_closed_by_zone', rutasProtegidas, dataBase.put_apportionment_forecast_period_closed_by_zone);
app.put('/put_apportionment_forecast_period_closed_by_zone_cc', rutasProtegidas, dataBase.put_apportionment_forecast_period_closed_by_zone_cc);
app.get('/get_data_paso_tres_cc', rutasProtegidas, dataBase.get_data_paso_tres_cc);
app.get('/get_data_forecast_paso_tres_cc', rutasProtegidas, dataBase.get_data_forecast_paso_tres_cc);
app.get('/get_data_forecast_paso_tres', rutasProtegidas, dataBase.get_data_forecast_paso_tres);

app.get('/get_data_paso_tres_all_cc', rutasProtegidas, dataBase.get_data_paso_tres_all_cc);
app.get('/get_existing_total_budget_data_cc', rutasProtegidas, dataBase.get_existing_total_budget_data_cc);
app.get('/get_existing_total_forecast_budget_data_cc', rutasProtegidas, dataBase.get_existing_total_forecast_budget_data_cc);
app.get('/get_existing_total_forecast_budget_data', rutasProtegidas, dataBase.get_existing_total_forecast_budget_data);

app.get('/get_existing_total_budget_data', rutasProtegidas, dataBase.get_existing_total_budget_data);
app.put('/put_total_zone_budget_period_cc', rutasProtegidas, dataBase.put_total_zone_budget_period_cc);
app.put('/put_total_zone_forecast_cc', rutasProtegidas, dataBase.put_total_zone_forecast_cc);
app.put('/put_total_zone_forecast', rutasProtegidas, dataBase.put_total_zone_forecast);

app.put('/put_budget_next_year_cc', dataBase.put_budget_next_year_cc);
app.put('/put_forecast_next_year', dataBase.put_forecast_next_year);
app.get('/get_budget_next_year_cc', rutasProtegidas, dataBase.get_budget_next_year_cc);
app.put('/update_budget_next_year_cc', rutasProtegidas, dataBase.update_budget_next_year_cc);
app.put('/put_budget_next_year', rutasProtegidas, dataBase.put_budget_next_year);
app.get('/select_non_cc', rutasProtegidas, dataBase.select_non_cc);

app.put('/put_p4_data_cc', rutasProtegidas, dataBase.put_p4_data_cc);
app.put('/put_p4_data', rutasProtegidas, dataBase.put_p4_data);
app.put('/put_p4_forecast_data', rutasProtegidas, dataBase.put_p4_forecast_data);
app.put('/put_p5_data_cc', rutasProtegidas, dataBase.put_p5_data_cc);
app.put('/put_p5_data', rutasProtegidas, dataBase.put_p5_data);
app.put('/put_p5_data_forecast', rutasProtegidas, dataBase.put_p5_data_forecast);

app.get('/get_data_csv', rutasProtegidas, dataBase.get_data_csv);
app.get('/get_data_csv_cc', rutasProtegidas, dataBase.get_data_csv_cc);

// F2

// Sellers
app.get('/get_all_sellers', rutasProtegidas, dataBase.get_all_sellers);
app.post('/insert_new_seller', rutasProtegidas, dataBase.insert_new_seller);
app.put('/update_seller', rutasProtegidas, dataBase.update_seller);
app.delete('/delete_seller', rutasProtegidas, dataBase.delete_seller);
app.get('/get_name_seller_bypk', rutasProtegidas, dataBase.get_name_seller_bypk);
app.get('/get_pk_seller_byname', rutasProtegidas, dataBase.get_pk_seller_byname);
app.get('/get_all_sellers_names', rutasProtegidas, dataBase.get_all_sellers_names);

// commercial zones

app.get('/get_all_commercial_zones', rutasProtegidas, dataBase.get_all_commercial_zones);

// Customers
app.get('/get_all_customers', rutasProtegidas, dataBase.get_all_customers);
app.post('/insert_new_customer', rutasProtegidas, dataBase.insert_new_customer);
app.get('/get_pk_customer_byname', rutasProtegidas, dataBase.get_pk_customer_byname);
app.put('/update_customer', rutasProtegidas, dataBase.update_customer);
app.delete('/delete_customer', rutasProtegidas, dataBase.delete_customer);
app.get('/get_all_cc', rutasProtegidas, dataBase.get_all_cc);

// Stores CC
app.get('/get_all_stores_cc', rutasProtegidas, dataBase.get_all_stores_cc);
app.post('/insert_new_store', rutasProtegidas, dataBase.insert_new_store);
app.put('/update_store', rutasProtegidas, dataBase.update_store);
app.delete('/delete_store', rutasProtegidas, dataBase.delete_store);

// reportes
// reportes
app.get('/reporte_resumen', rutasProtegidas,  dataBase.reporte_resumen)
app.get('/reporte_entidad_consolidado', rutasProtegidas,  dataBase.reporte_entidad_consolidado)
app.get('/reporte_entidad_zona_comercial', rutasProtegidas,  dataBase.reporte_entidad_zona_comercial)
app.get('/reporte_entidad_cc', rutasProtegidas,  dataBase.reporte_entidad_cc)
app.get('/reporte_resumen3', rutasProtegidas,  dataBase.reporte_resumen3)
app.get('/reporte_resumen_zona', rutasProtegidas,  dataBase.reporte_resumen_zona)
app.get('/reporte_resumen_cc', rutasProtegidas,  dataBase.reporte_resumen_cc)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;


