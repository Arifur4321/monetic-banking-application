/* Default Imports */
import { Injectable } from '@angular/core';

/* Custom Imports */
import * as myGlobals from 'src/globals/globals';
import { AuthenticationService } from '../authentication.service';
import { CityDto } from 'src/app/model/city-dto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProvinceDto } from 'src/app/model/province-dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GeographicService {
  private geoCitiesDTO: CityDto[];
  private geoProvincesDTO: ProvinceDto[];
  private headers: HttpHeaders;
  private restCitiesUrl: string;
  private restProvincesUrl: string;

  constructor(
    private authService: AuthenticationService,
    private httpClient: HttpClient
  ) {
    this.headers = this.authService.getCpyHeader();
    this.restCitiesUrl = environment.basicUrl + myGlobals.geoAllCities;
    this.restProvincesUrl = environment.basicUrl + myGlobals.geoAllProvinces;

    this.httpClient
      .get<CityDto[]>(this.restCitiesUrl, { headers: this.headers })
      .subscribe((response) => {
        this.geoCitiesDTO = response;
      });

    this.httpClient
      .get<ProvinceDto[]>(this.restProvincesUrl, { headers: this.headers })
      .subscribe((response) => {
        this.geoProvincesDTO = response;
      });
  }

  /* DA VERIFICARE */
  getAllCities() {
    return this.geoCitiesDTO;
  }

  /* DA VERIFICARE */
  getAllCitiesByProvince(provinceId: string) {
    let citiesByProvince: CityDto[];

    citiesByProvince = this.geoCitiesDTO.filter(
      (city) => city.idProvince === provinceId
    );

    return citiesByProvince;
  }

  /* DA VERIFICARE */
  getAllProvinces() {
    return this.geoProvincesDTO;
  }
}
