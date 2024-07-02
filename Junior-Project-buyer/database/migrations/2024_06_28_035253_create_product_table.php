<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductTable extends Migration
{
    public function up()
    {
        Schema::create('product', function (Blueprint $table) {
            $table->id('product_id')->unsigned();
            $table->unsignedInteger('business_id') -> default(1);
            $table->string('product_title', 255);
            $table->string('product_description', 255);
            $table->string('product_price', 255);
            $table->string('product_image', 255);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('product');
    }
}

