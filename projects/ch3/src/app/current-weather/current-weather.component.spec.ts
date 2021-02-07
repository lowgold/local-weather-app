import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { CurrentWeatherComponent } from './current-weather.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { WeatherService } from '../weather/weather.service'
import { injectSpy } from 'angular-unit-test-helper'
import { of } from 'rxjs'
import { By } from '@angular/platform-browser'
import { fakeWeather } from '../weather/weather.service.fake'

describe('CurrentWeatherComponent', () => {
  let component: CurrentWeatherComponent
  let fixture: ComponentFixture<CurrentWeatherComponent>

  let weatherServiceMock: jasmine.SpyObj<WeatherService>

  beforeEach(
    waitForAsync(() => {
      const weatherServiceSpy = jasmine.createSpyObj('WeatherService', [
        'getCurrentWeather',
      ])

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CurrentWeatherComponent],
        providers: [
          {
            provide: WeatherService,
            useValue: weatherServiceSpy,
          },
        ],
      }).compileComponents()

      weatherServiceMock = injectSpy(WeatherService)
    })
  )

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentWeatherComponent)
    component = fixture.componentInstance
  })

  it('should create', () => {
    weatherServiceMock.getCurrentWeather.and.returnValue(of())
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })

  it('should get currentWeather from weatherService', () => {
    // Arrange
    weatherServiceMock.getCurrentWeather.and.returnValue(of())
    // Act
    fixture.detectChanges() // triggers ngOnInit()
    // Assert
    expect(weatherServiceMock.getCurrentWeather).toHaveBeenCalledTimes(1)
  })

  it('should eagerly load currentWeather in Bethesda from weatherService', () => {
    // Arrange
    weatherServiceMock.getCurrentWeather.and.returnValue(of(fakeWeather))
    // Act
    fixture.detectChanges() // triggers ngOnInit()
    // Assert
    expect(component.current).toBeDefined()
    expect(component.current.city).toEqual('Bethesda!')
    expect(component.current.temperature).toEqual(280.32)
    // Assert on DOM
    const debugEl = fixture.debugElement
    const titleEl: HTMLElement = debugEl.query(By.css('span')).nativeElement
    expect(titleEl.textContent).toContain('Bethesda')
  })
})
