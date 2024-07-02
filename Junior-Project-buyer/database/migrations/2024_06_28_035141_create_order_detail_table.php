<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrderDetailTable extends Migration
{
    public function up()
    {
        Schema::create('order_detail', function (Blueprint $table) {
            $table->id('order_detail_id')->unsigned();
            $table->unsignedInteger('business_id');
            $table->unsignedInteger('buyer_id');
            $table->string('customer_contact', 255);
            $table->string('order_date', 255);
            $table->string('delivery_location', 255);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('order_detail');
    }
}
